import * as Localization from 'expo-localization';

const globalLangCode = Localization.locale.replace(/[-_][a-z]+$/i, "");

let globalFacility: string;

export const setFacility = (facility: string) => {
  globalFacility = facility;
};

export { globalFacility, globalLangCode };
