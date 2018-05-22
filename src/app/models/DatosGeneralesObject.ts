import { DatosGeneralesItem } from "./DatosGeneralesItem";
import { ErrorItem } from "./ErrorItem";
export class DatosGeneralesObject {
  error: Error;
  DatosGeneralesItem: DatosGeneralesItem[] = [];
  constructor() {}
}
