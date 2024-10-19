interface Substance {
    substance_name: string;
    x: number; // original
    y: number; // original
    case_type: ObjectType;
}

interface SubstanceProps extends Substance {
    entity_id: number;
    movedX: number;
    movedY: number;
    draggable: boolean;
}

interface Lab {
    id: number,
    lab_name: string;
    goal: string;
}

interface LabWithSubs {
    lab_name: string;
    goal: string;
    // @ts-ignore
    substances: Substance[];
}

type Inventory = {
    entity_id: number,
    substance_name: string;
    x: number;
    y: number;
    case_type: ObjectType;
}[];

interface Rectangle {
    top: number;
    left: number;
    width: number;
    height: number;
  }

const DEFAULT_SIZE: Record<ObjectType, {width: number, height: number}> = {
    beaker: {
        width: 104,
        height: 343,
    },
    dropper: {
        width: 104,
        height: 343,
    },
    bottle: {
        width: 104,
        height: 343,
    },
    flask: {
        width: 349,
        height: 489,
    }
}

type ObjectType = "flask" | "bottle" | "dropper" | "beaker";

export type {Substance, LabWithSubs, Lab, Inventory, Rectangle, SubstanceProps, ObjectType}

export {DEFAULT_SIZE};