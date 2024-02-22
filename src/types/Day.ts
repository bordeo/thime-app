import { Hour } from "./Hour";

export interface Day {
  id: string;
  hours?: {
    [id: string]: Hour;
  };
}
