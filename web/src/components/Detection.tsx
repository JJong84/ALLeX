import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Human, { Config, Point } from '@vladmandic/human'
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

const THRESHHOLD = 260;

interface Props {
    inventory?: Inventory;
}

function Detection({inventory}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [resolution, setResolution] = useState<{width?: number; height?: number;}>({ width: 640, height: 480 });
    const [human, setHuman] = useState<Human | null>(null);
    const [detectedHand, setDetectedHand] = useState<Rectangle | undefined>(undefined);
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

    const [isFistState, setIsFistState] = useState<boolean>(false);

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

    const calculateFingerDistance = (keypoints: Point[]) => {
        const fingerPairs = [
            [5, 8],   // Index finger
            [9, 12],  // Middle finger
            [13, 16], // Ring finger
            [17, 20], // Pinky
            [1, 4]    // Thumb
        ];

        let totalDistance = 0;

        fingerPairs.forEach(([startIdx, endIdx]) => {
            const start = keypoints[startIdx];
            const end = keypoints[endIdx];
            const distance = Math.sqrt(
                Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2)
            );
            totalDistance += distance;
        });
        console.log(totalDistance);
        return totalDistance;
    };

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
            console.log(firstHand);
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

            const fingerDistance = calculateFingerDistance(firstHand.keypoints);
            
            if (fingerDistance < THRESHHOLD) {
                setIsFistState(true);
            } else {
                setIsFistState(false);
            }
        }

        requestAnimationFrame(detectionLoop); // start new frame immediately
    }

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
                detectedHand && <DetectedHand isDebug top={detectedHand.top} left={detectedHand.left} width={detectedHand.width} height={detectedHand.height} />
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
