import { DatosGeneralesItem } from "./DatosGeneralesItem";
import { ErrorItem } from "./ErrorItem";
export class DatosGeneralesObject {
  error: Error;
  personaJuridicaItems: DatosGeneralesItem[] = [];
  constructor() {}
}
