import { DatosBancariosItem } from "./DatosBancariosItem";
import { ErrorItem } from "./ErrorItem";
export class DatosBancariosObject {
  error: ErrorItem;
  datosBancariosItem: DatosBancariosItem[] = [];
  constructor() { }
}
