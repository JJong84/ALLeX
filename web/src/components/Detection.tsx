import { useEffect, useRef, useState } from 'react'
import Human from '@vladmandic/human'
import './detection.css'
import DetectedHand from './DetectedHand';
import { Inventory, Rectangle, SubstanceProps } from '../types';
import SubstanceComp from './Substance';
import { isOverlapping } from '../helpers';

const humanConfig = {
    async: false,
    debug: true,
    cacheSensitivity: 0,
    cacheModels: true,
    // modelBasePath: '@vladmandic/human-models/models/',
    modelBasePath: '/node_modules/@vladmandic/human/models/',
    face: {
        scale: 1.4,
        detector: { enabled: true, maxDetected: 1, minSize: 256 },
        mesh: { enabled: true },
        iris: { enabled: false },
        description: { enabled: false },
        emotion: { enabled: true, crop: 0.15 },
    },
    body: { enabled: false },
    hand: { enabled: true },
    object: { enabled: false },
    gestures: { enabled: false },
};

interface Props {
    inventory?: Inventory;
}

function Detection({inventory}: Props) {
    const [substances, setSubstances] = useState<SubstanceProps[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [human, setHuman] = useState<Human | null>(null);
    const [detectedHand, setDetectedHand] = useState<Rectangle | undefined>(undefined);

    useEffect(() => {
        if (inventory) {
            const subs = inventory?.map((i) => ({
                ...i,
                isOverlapped: false,
                movedX: i.x,
                movedY: i.y,
            }))
            setSubstances(subs);
        }
    }, [inventory]);

    useEffect(() => {
        // 비디오 스트림 시작
        const startVideo = async () => {
            try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
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
            setDetectedHand({
                height, width, top, left
            })
        }

        requestAnimationFrame(detectionLoop); // start new frame immediately
    }

    useEffect(() => {
        requestAnimationFrame(detectionLoop);
    }, [human]);

    useEffect(() => {
        if (detectedHand) {
            setSubstances((prevSubstances) =>
                prevSubstances.map((s) => {
                    const subRect: Rectangle = {
                        top: s.y,
                        left: s.x,
                        width: 300,  // 예시로 가로/세로 값을 지정해 줍니다. 실제로는 substance의 크기에 맞게 설정.
                        height: 300, // 필요한 경우 수정하세요.
                    };
                    
                    // 손과 물질이 겹치는 경우
                    if (isOverlapping(detectedHand, subRect)) {
                        // 해당 항목의 isOverlapped를 true로 설정
                        return { ...s, isOverlapped: true };
                    }
                    
                    // 변경 사항이 없을 경우 기존 항목을 그대로 반환
                    return s;
                })
            );
        }
    }, [detectedHand]);

    useEffect(() => {
        if (detectedHand) {
            setSubstances((prevSubstances) =>
                prevSubstances.map((s) => {
                    if (s.isOverlapped) {
                        return { ...s, movedX: detectedHand?.left, movedY: detectedHand?.top };
                    }                
                    return s;
                })
            )
        }
    }, [detectedHand, substances]);

  return (
    <>
        <div id="video-container">
            <video id="video-element" ref={videoRef} width="600" height="450" autoPlay muted></video>
            {
                detectedHand && <DetectedHand top={detectedHand.top} left={detectedHand.left} width={detectedHand.width} height={detectedHand.height} />
            }
            {substances ? 
                substances.map((sub) => <SubstanceComp key={sub.entity_id} {...sub} />)
            : (
                <p>Loading inventory...</p>
            )}
        </div>
    </>
  )
}

export default Detection
