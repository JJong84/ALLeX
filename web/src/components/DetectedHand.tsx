import './detection.css'

interface DetectedHandProps {
    top: number,
    left: number,
    width: number,
    height: number,
    isDebug?: boolean;
}

function DetectedHand({top, left, width, height, isDebug}: DetectedHandProps) {
  return (
    <div id={isDebug ? "hand" : ""} style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
    }} />
  )
}

export default DetectedHand
