import { EnviosMasivosItem } from "./ComunicacionesItem";
import { ErrorItem } from "./ErrorItem";

export class ComunicacionesObject {
  error: ErrorItem;
  enviosMasivosItem: EnviosMasivosItem[] = [];
  constructor() { }
}
