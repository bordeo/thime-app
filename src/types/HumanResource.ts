import { UnitType } from "./UnitType";
export interface HumanResource {
  id: string;
  name: string;
  surname?: string;
  unitCost: number;
  unitType?: UnitType;
}
