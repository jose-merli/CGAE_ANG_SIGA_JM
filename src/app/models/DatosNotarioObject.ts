import { DatosNotarioItem } from "./DatosNotarioItem";
import { ErrorItem } from "./ErrorItem";
export class DatosNotarioObject {
  error: ErrorItem;
  fichaPersonaItem: DatosNotarioItem[] = [];
  constructor() { }
}
