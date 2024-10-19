interface Substance {
    substance_name: string;
    x: number; // original
    y: number; // original
    case_type: string;
    movedX: number;
    movedY: number;
}

interface SubstanceProps extends Substance {
    entity_id: number;
    isOverlapped: boolean;
}

interface Lab {
    id: number,
    lab_name: string;
    goal: string;
}

interface LabWithSubs {
    lab_name: string;
    goal: string;
    substances: Substance[];
}

type Inventory = {
    entity_id: number,
    substance_name: string;
    x: number;
    y: number;
    case_type: string;
}[];

interface Rectangle {
    top: number;
    left: number;
    width: number;
    height: number;
  }
  

export type {Substance, LabWithSubs, Lab, Inventory, Rectangle, SubstanceProps}