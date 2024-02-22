import { LocaleConfig } from "react-native-calendars";
import { globalLangCode } from "../utils/globals";

LocaleConfig.locales["it"] = {
  monthNames: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ],
  monthNamesShort: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic"
  ],
  dayNames: [
    "Domenica",
    "Lunedí",
    "Martedí",
    "Mercoledí",
    "Giovedí",
    "Venerdí",
    "Sabato"
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
};

if (globalLangCode in LocaleConfig.locales) {
  LocaleConfig.defaultLocale = globalLangCode;
}
