import moment from "moment";
import "moment/locale/it";
import { globalLangCode } from "../utils/globals";

moment.locale(globalLangCode);

export default moment;
