import { DatosMandatosItem } from "./DatosMandatosItem";
import { ErrorItem } from "./ErrorItem";
export class DatosMandatosObject {
  error: ErrorItem;
  mandatosItem: DatosMandatosItem[] = [];
  constructor() {}
}
