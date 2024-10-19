import { useEffect, useRef, useState } from 'react'
import Human, { Config, HandType } from '@vladmandic/human'
import DetectedHand from './DetectedHand';
import { Inventory, Rectangle } from '../types';
import SubstanceComp from './Substance';
import { isOverlapping } from '../helpers';

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
        height: window.innerHeight,
        width: window.innerWidth
    },
};

interface Props {
    inventory?: Inventory;
}

function Detection({inventory}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [human, setHuman] = useState<Human | null>(null);
    const [detectedHand, setDetectedHand] = useState<Rectangle | undefined>(undefined);
    const [detectedHandLabel, setDetectedHandLabel] = useState<HandType | undefined>(undefined);
    const [attachedSubstanceId, setAttachedSubstanceId] = useState<number | undefined>(undefined);

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
                // setDetectedHand(undefined);
                // setDetectedHandLabel(undefined);
                // setAttachedSubstanceId(undefined);
                requestAnimationFrame(detectionLoop);
                return;
            }
            const firstHand = hand[0];
            const [left, top, width, height] = firstHand.box;
            setDetectedHand({
                height, width, top, left: left
            })
            setDetectedHandLabel(firstHand.label);
            console.log(firstHand.label);
        }

        requestAnimationFrame(detectionLoop); // start new frame immediately
    }

    useEffect(() => {
        requestAnimationFrame(detectionLoop);
    }, [human]);

    const isFist = (label?: HandType): boolean => {
        return label == "fist" || label == "point";
    }

    useEffect(() => {
        if (detectedHand) {
            inventory?.map((s) => {
                const subRect: Rectangle = {
                    top: s.y,
                    left: s.x,
                    width: 300,  // 예시로 가로/세로 값을 지정해 줍니다. 실제로는 substance의 크기에 맞게 설정.
                    height: 300, // 필요한 경우 수정하세요.
                };
                
                // 손과 물체가 겹치고, 오므렸을 때
                if (isOverlapping(detectedHand, subRect) && isFist(detectedHandLabel)) {
                    setAttachedSubstanceId(s.entity_id);
                }
            })
        }
    }, [detectedHand, detectedHandLabel, inventory]);

  return (
    <>
        <div id="video-container">
            <video id="video-element" ref={videoRef} width="100%" height="100%" autoPlay muted></video>
            {
                detectedHand && <DetectedHand top={detectedHand.top} left={detectedHand.left} width={detectedHand.width} height={detectedHand.height} />
            }
            {inventory ? 
                inventory.map((sub) => {
                    if (sub.entity_id === attachedSubstanceId) {
                        return <SubstanceComp key={sub.entity_id} {...sub} movedX={detectedHand?.left} movedY={detectedHand?.top} />
                    }
                    return <SubstanceComp key={sub.entity_id} {...sub} movedX={sub.x} movedY={sub.y} />
            })
            : (
                <p>Loading inventory...</p>
            )}
        </div>
    </>
  )
}

export default Detection
