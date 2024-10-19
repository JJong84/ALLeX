import { Rectangle } from "./types";

const isOverlapping = (rectA: Rectangle, rectB: Rectangle) => {
    const rectARight = rectA.left + rectA.width;
    const rectABottom = rectA.top + rectA.height;
    const rectBRight = rectB.left + rectB.width;
    const rectBBottom = rectB.top + rectB.height;

    // 사각형이 겹치지 않는 경우
    if (rectA.left > rectBRight || rectARight < rectB.left || rectA.top > rectBBottom || rectABottom < rectB.top) {
        return false;
    }

    // 사각형이 겹치는 경우
    return true;
}

export {isOverlapping};

