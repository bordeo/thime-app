import { UnitType } from "./UnitType";

export interface Hour {
  id: string;
  unit: number;
  unitCost: number;
  unitType: UnitType;
  total: number;
}
