import { ErrorItem } from "./ErrorItem";
import { RetencionesItem } from "./RetencionesItem";
export class DatosRetencionesDto {
  error: ErrorItem;
  idPersona: String;
  retencionesItemList: RetencionesItem[] = [];
  constructor() {}
}
