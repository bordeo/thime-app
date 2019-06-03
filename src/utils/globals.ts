import { Localization } from "expo";

const globalLangCode = Localization.locale.replace(/[-_][a-z]+$/i, "");

let globalFacility: string;

export const setFacility = (facility: string) => {
  globalFacility = facility;
};

export { globalFacility, globalLangCode };
