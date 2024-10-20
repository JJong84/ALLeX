import './detection.css'

interface DetectedHandProps {
    top: number,
    left: number,
    width: number,
    height: number,
    isFistState: boolean;
    isDebug?: boolean;
}

function DetectedHand({top, left, width, height, isFistState}: DetectedHandProps) {
  return (
    <div id={isFistState ? "fist" : "hand"} style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
    }} />
  )
}

export default DetectedHand
