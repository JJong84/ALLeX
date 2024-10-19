import { Rectangle, SubstanceNames } from "./types";

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

const addSubstance = (sDropper: SubstanceNames, sFlask: SubstanceNames): SubstanceNames => {
    if (sDropper === "물") {
        switch (sFlask) {
            case "BTB":
                return "BTB+물";
            case "메틸 오렌지":
                return "메틸 오렌지+물";
            case "페놀프탈레인":
                return "페놀프탈레인+물";
            default:
                return sFlask;
        }
    }
    if (sDropper === "염산") {
        switch (sFlask) {
            case "BTB":
                return "BTB+염산";
            case "메틸 오렌지":
                return "메틸 오렌지+염산";
            case "페놀프탈레인":
                return "페놀프탈레인+염산";
            default:
                return sFlask;
        }
    }
    if (sDropper === "암모니아") {
        switch (sFlask) {
            case "BTB":
                return "BTB+암모니아";
            case "메틸 오렌지":
                return "메틸 오렌지+암모니아";
            case "페놀프탈레인":
                return "페놀프탈레인+암모니아";
            default:
                return sFlask;
        }
    }
    return sDropper;
}

export {isOverlapping, addSubstance};

