import i18n from "i18n-js";
import { globalLangCode } from "../utils/globals";
import en from "./en";
import it from "./it";

i18n.fallbacks = true;
i18n.translations = { en, it };
i18n.locale = globalLangCode;

export default i18n;
