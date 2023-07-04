import { ErrorItem } from "./ErrorItem";
import { DatosRetencionesItem } from "./DatosRetencionesItem";
export class DatosRetencionesObject {
  error: ErrorItem;
  idPersona: String;
  retencionesItemList: DatosRetencionesItem[] = [];
  activo: boolean;
  constructor() { }
}
