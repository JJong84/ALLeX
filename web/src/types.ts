import { getSubstances } from "./axios";

import flaskBTBImg from './assets/Flask-BTB.png';
import flaskBTBH2OImg from './assets/Flask-BTB+H2O.png';
import flaskBTBHCLImg from './assets/Flask-BTB+HCL.png';
import flaskBTBNH3Img from './assets/Flask-BTB+NH3.png';
import flaskMethylOrangeImg from './assets/Flask-Methyl_orange.png';
import flaskMethylOrangeH2OImg from './assets/Flask-Methyl_orange+H2O.png';
import flaskMethylOrangeHCLImg from './assets/Flask-Methyl_orange+HCL.png';
import flaskMethylOrangeNH3Img from './assets/Flask-Methyl_orange+NH3.png';
import flaskPhenolphthaleinImg from './assets/Flask-Phenolphthalein.png';
import flaskPhenolphthaleinH2OImg from './assets/Flask-Phenolphthalein+H2O.png';
import flaskPhenolphthaleinHCLImg from './assets/Flask-Phenolphthalein+HCL.png';
import flaskPhenolphthaleinNH3Img from './assets/Flask-Phenolphthalein+NH3.png';

import h2oImg from './assets/H2O.png';
import hclImg from './assets/HCL.png';
import nh3Img from './assets/NH3.png';
import emptyH2oImg from './assets/H2O-.png';
import emptyHclImg from './assets/HCL-.png';
import emptyNh3Img from './assets/NH3-.png';

interface Substance {
    substance_name: SubstanceNames | "";
    x: number; // original
    y: number; // original
    case_type: ObjectType;
    image?: string;
    substance_id?: number;
}

interface SubstanceProps extends Substance {
    entity_id: number;
    movedX: number;
    movedY: number;
    draggable: boolean;
    currentSubstanceName: SubstanceNames; // 변형한 후의 물질
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
    substance_name: SubstanceNames;
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

  const DEFAULT_SIZE: Record<ObjectType, { width: number, height: number }> = {
    beaker: {
        width: Math.round((104 / 343) * 300),
        height: 300,
    },
    dropper: {
        width: Math.round((104 / 343) * 300),
        height: 300,
    },
    bottle: {
        width: Math.round((104 / 343) * 300),
        height: 300,
    },
    flask: {
        width: Math.round((349 / 489) * 300),
        height: 300,
    }
};

type ObjectType = "flask" | "bottle" | "dropper" | "beaker";

type SubstanceNames =
| 'BTB'
| 'BTB+물'
| 'BTB+염산'
| 'BTB+암모니아'
| '메틸 오렌지'
| '메틸 오렌지+물'
| '메틸 오렌지+염산'
| '메틸 오렌지+암모니아'
| '페놀프탈레인'
| '페놀프탈레인+물'
| '페놀프탈레인+염산'
| '페놀프탈레인+암모니아'
| '물'
| '염산'
| '암모니아';

type GetSubstanceObj = {substance_id: number, substance_name: SubstanceNames}[];

// Hardcoded dictionary mapping substances to images
const substanceImages: Record<SubstanceNames, string> = {
  'BTB': flaskBTBImg,
  '메틸 오렌지': flaskMethylOrangeImg,
  '페놀프탈레인': flaskPhenolphthaleinImg,
  'BTB+물': flaskBTBH2OImg,
  'BTB+염산': flaskBTBHCLImg,
  'BTB+암모니아': flaskBTBNH3Img,
  '메틸 오렌지+물': flaskMethylOrangeH2OImg,
  '메틸 오렌지+염산': flaskMethylOrangeHCLImg,
  '메틸 오렌지+암모니아': flaskMethylOrangeNH3Img,
  '페놀프탈레인+물': flaskPhenolphthaleinH2OImg,
  '페놀프탈레인+염산': flaskPhenolphthaleinHCLImg,
  '페놀프탈레인+암모니아': flaskPhenolphthaleinNH3Img,
  '물': h2oImg,
  '염산': hclImg,
  '암모니아': nh3Img,
  // 추가 용액들 필요시 추가
};

const emptyBottleImages: Record<string, string> = {
    '물': emptyH2oImg,
  '염산': emptyHclImg,
  '암모니아': emptyNh3Img,
}

export type {Substance, LabWithSubs, Lab, Inventory, Rectangle, SubstanceProps, ObjectType, SubstanceNames, GetSubstanceObj}

export {DEFAULT_SIZE, substanceImages, emptyBottleImages};