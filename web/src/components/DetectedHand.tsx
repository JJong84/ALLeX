import './detection.css'

interface DetectedHandProps {
    top: number,
    left: number,
    width: number,
    height: number
}

function DetectedHand({top, left, width, height}: DetectedHandProps) {
  return (
    <div id="hand" style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
    }} />
  )
}

export default DetectedHand
