import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Human, { Config, HandType } from '@vladmandic/human'
import DetectedHand from './DetectedHand';
import { DEFAULT_SIZE, Inventory, ObjectType, Rectangle, SubstanceNames, SubstanceProps } from '../types';
import SubstanceComp from './Substance';
import { addSubstance, isOverlapping } from '../helpers';

const humanConfig: Partial<Config> = {
    async: false,
    debug: true,
    cacheSensitivity: 0,
    cacheModels: true,
    // modelBasePath: '@vladmandic/human-models/models/',
    modelBasePath: '/node_modules/@vladmandic/human/models/',
    body: { enabled: false },
    hand: { enabled: true },
    object: { enabled: false },
    filter: {
        flip: true,
    },
    backend: 'tensorflow'
};

const HAND_STATE_THRESHOLD = 3; // 5 프레임 동안 유지
const FIST_DETECTION_DELAY = 3; // 10 프레임 동안 상태를 유지

interface Props {
    inventory?: Inventory;
}

function Detection({inventory}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [resolution, setResolution] = useState<{width?: number; height?: number;}>({ width: 640, height: 480 });
    const [human, setHuman] = useState<Human | null>(null);
    const [detectedHand, setDetectedHand] = useState<Rectangle | undefined>(undefined);
    // @ts-ignore
    const [detectedHandLabel, setDetectedHandLabel] = useState<HandType | undefined>(undefined);
    const [attachedSubstanceId, setAttachedSubstanceId] = useState<number | undefined>(undefined);

    const [substances, setSubstances] = useState<SubstanceProps[]>([]);

    useEffect(() => {
        if (inventory) {
            const list: SubstanceProps[] = []
            inventory.forEach((s) => {
                if (s.case_type == "bottle") {
                    const target: ObjectType = "dropper";
                    list.push({
                        ...s,
                        entity_id: s.entity_id + 100, // TODO for unique key
                        draggable: isDraggable(target),
                        case_type: target,
                        movedX: s.x + DEFAULT_SIZE[target].width / 2,
                        movedY: s.y + DEFAULT_SIZE[target].height / 2,
                        currentSubstanceName: s.substance_name
                    })
                    list.push({
                        ...s,
                        draggable: isDraggable(s.case_type),
                        movedX: s.x + DEFAULT_SIZE[s.case_type].width / 2,
                        movedY: s.y + DEFAULT_SIZE[s.case_type].height / 2,
                        currentSubstanceName: s.substance_name
                    })
                } else {
                    list.push({
                        ...s,
                        draggable: isDraggable(s.case_type),
                        movedX: s.x + DEFAULT_SIZE[s.case_type].width / 2,
                        movedY: s.y + DEFAULT_SIZE[s.case_type].height / 2,
                        currentSubstanceName: s.substance_name
                    })
                }
            });
            console.log(list);
            setSubstances(list);
        }
    }, [inventory]);

    const [handStateHistory, setHandStateHistory] = useState<boolean[]>([]);
    const [isFistState, setIsFistState] = useState<boolean>(false);
    const [frameCounter, setFrameCounter] = useState<number>(0);
    const isFist = (label?: HandType): boolean => {
        return label == "fist" || label == "point" || label == "pinch";
    }

    useEffect(() => {
        // 비디오 스트림 시작
        const startVideo = async () => {
            try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    const track = stream.getVideoTracks()[0];
                    const { width, height } = track.getSettings();
                    setResolution({ width, height });
                };
            }
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };
        startVideo();

        setHuman(new Human(humanConfig));
    }, []);

    async function detectionLoop() { // main detection loop
        const input = videoRef.current;
        if (!input) {
            console.log("no video");
            return;
        }
        const result = await human?.detect(input);       
        if (result?.hand) {            
            const hand = result?.hand;
            if (!hand.length) {
                requestAnimationFrame(detectionLoop);
                return;
            }
            const firstHand = hand[0];
            const [left, top, width, height] = firstHand.box;
            // console.log(resolution);
            if (!resolution.width || !resolution.height) {
                requestAnimationFrame(detectionLoop);
                return;
            }
            const widthRatio = window.innerWidth / resolution.width;
            const heightRatio = window.innerHeight / resolution.height;
            
            setDetectedHand({
                height: height * heightRatio, width: width * widthRatio, top: top * heightRatio, left: left * widthRatio
            })
            
            const currentFistState = isFist(firstHand.label);
            setHandStateHistory((prevHistory) => {
                const newHistory = [...prevHistory, currentFistState];
                if (newHistory.length > HAND_STATE_THRESHOLD) {
                    newHistory.shift(); // 오래된 기록은 제거
                }
                return newHistory;
            });
            setDetectedHandLabel(firstHand.label);
        }

        requestAnimationFrame(detectionLoop); // start new frame immediately
    }

    useEffect(() => {
        // 손 상태를 유지할지 여부를 결정
        if (handStateHistory.filter((state) => state).length >= HAND_STATE_THRESHOLD - 1) {
            setIsFistState(true);
            setFrameCounter(0); // 상태가 유지될 프레임 카운터 초기화
        } else {
            if (frameCounter < FIST_DETECTION_DELAY) {
                setFrameCounter((prevCounter) => prevCounter + 1); // 카운터 증가
            } else {
                setIsFistState(false); // 카운터가 임계값을 넘으면 상태 전환
            }
        }
    }, [handStateHistory, frameCounter]);

    useEffect(() => {
        requestAnimationFrame(detectionLoop);
    }, [human]);

    const attachedSubstance = useMemo(() => {
        return substances.find((s) => s.entity_id === attachedSubstanceId)
    }, [substances, attachedSubstanceId]);

    const addDropperToFlask = useCallback(() => {
        console.log("add dropper to flask");
        // TODO 두 개가 애매하게 놓여있을 때 이상하게 보여질 수 있음
        if (!attachedSubstance) {
            return;
        }

        const aRect = {
            top: attachedSubstance.movedY,
            left: attachedSubstance.movedX,
            ...DEFAULT_SIZE[attachedSubstance.case_type]
        }

        let newSubstanceId: number | undefined = undefined;
        let newSubstanceName: SubstanceNames | undefined = undefined;

        const newList = substances.map((s) => {
            if (newSubstanceId) {
                return s;
            }
            if (s.case_type !== "flask") {
                return s;
            }
            const sRect = {
                top: s.movedY,
                left: s.movedX,
                ...DEFAULT_SIZE[s.case_type]
            }

            if (isOverlapping(aRect, sRect)) {
                console.log('overlapped');
                newSubstanceName = addSubstance(attachedSubstance.currentSubstanceName, s.currentSubstanceName);
                newSubstanceId = s.entity_id;
                console.log(newSubstanceName);
                return {...s, substance_name: newSubstanceName};
            } else {
                console.log('not overlapped');
                return s;
            }
        });

        setSubstances(newList);
    }, [attachedSubstance, substances]);

    useEffect(() => {
        if (!isFistState) {
            if (attachedSubstanceId) {
                console.log(`Release ${attachedSubstanceId}`);
                // 플라스크에 닿아있다면, 플라스크의 current물질 변경
                addDropperToFlask();
            }
            setDetectedHand(undefined);
            setDetectedHandLabel(undefined);
            setAttachedSubstanceId(undefined);
        }
        else if (detectedHand && isFistState) {
            substances?.forEach((s) => {
                if (!s.draggable) {
                    return;
                }
                const subRect = {
                    top: s.movedY,
                    left: s.movedX,
                    ...DEFAULT_SIZE[s.case_type]
                }    
                
                // 손과 물체가 겹치고, 오므렸을 때
                if (attachedSubstanceId === undefined && isOverlapping(detectedHand, subRect)) {
                    setAttachedSubstanceId(s.entity_id);
                    console.log(`Set Attached" ${s.entity_id}`)
                }
            })
        }
    }, [detectedHand, isFistState, substances, addDropperToFlask, attachedSubstanceId]);

    useEffect(() => {
        if (attachedSubstanceId && detectedHand) {
            setSubstances((old) => old.map((s) => {
                if (s.entity_id === attachedSubstanceId) {
                    return {
                        ...s,
                        movedX: detectedHand.left + detectedHand.width / 2,
                        movedY: detectedHand.top + detectedHand.height / 2,
                    };
                } else {
                    return s;
                }
            }))
        }
    }, [attachedSubstanceId, detectedHand]);

    const isDraggable = (target: ObjectType): boolean => {
        return target == "dropper";
    }

  return (
    <>
        <div id="video-container">
            <video id="video-element" ref={videoRef} width="100%" height="100%" autoPlay muted></video>
            {
                detectedHand && <DetectedHand top={detectedHand.top} left={detectedHand.left} width={detectedHand.width} height={detectedHand.height} />
            }
            {substances ? 
                substances.map((sub) => {
                    if (sub.entity_id === attachedSubstanceId && detectedHand) {
                        return <SubstanceComp key={sub.entity_id} {...sub} />
                    }
                    return <SubstanceComp key={sub.entity_id} {...sub} />
            })
            : (
                <p>Loading inventory...</p>
            )}
        </div>
    </>
  )
}

export default Detection
