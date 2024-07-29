import { SupportedLang } from "../../../providers";
import * as curl from "./curl";
import * as go from "./go";
import * as nodejs from "./nodejs";
import * as php from "./php";
import * as python from "./python";
import * as ruby from "./ruby";

export enum TemplateType {
  LIST = "listRecords",
  CREATE = "createRecord",
  RETRIEVE = "retrieveRecord",
  UPDATE = "updateRecord",
  DELETE = "deleteRecord",
  COUNT = "countRecords",
}

const langToTemplates = {
  [SupportedLang.NODEJS]: nodejs,
  [SupportedLang.PYTHON]: python,
  [SupportedLang.RUBY]: ruby,
  [SupportedLang.GO]: go,
  [SupportedLang.PHP]: php,
  [SupportedLang.CURL]: curl,
};

export function getTemplate(options: {
  type: TemplateType;
  lang: SupportedLang;
}) {
  const { lang, type } = options;
  const engine = langToTemplates[lang];

  return engine[type];
}
