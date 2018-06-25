import { DatosIntegrantesItem } from "./DatosIntegrantesItem";
import { ErrorItem } from "./ErrorItem";

export class DatosIntegrantesObject {
  error: ErrorItem;
  datosIntegrantesItem: DatosIntegrantesItem[] = [];
  constructor() {}
}
