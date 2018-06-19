import { DatosIntegrantesItem } from "./DatosIntegrantesItem";
import { ErrorItem } from "./ErrorItem";

export class DatosIntegrantesObject {
  error: ErrorItem;
  datosIntegrantesItems: DatosIntegrantesItem[] = [];
  constructor() {}
}
