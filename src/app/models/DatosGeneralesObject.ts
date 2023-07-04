import { DatosGeneralesItem } from "./DatosGeneralesItem";
import { ErrorItem } from "./ErrorItem";
export class DatosGeneralesObject {
  error: ErrorItem;
  personaJuridicaItems: DatosGeneralesItem[] = [];
  constructor() { }
}
