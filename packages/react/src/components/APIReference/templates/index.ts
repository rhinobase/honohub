import { SupportedLang } from "../../../providers";
import * as curl from "./curl";
import * as nodejs from "./nodejs";
import * as python from "./python";

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
