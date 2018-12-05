import { ComunicacionesItem } from "./ComunicacionesItem";
import { ErrorItem } from "./ErrorItem";

export class ComunicacionesObject {
  error: ErrorItem;
  comunicacionesItem: ComunicacionesItem[] = [];
  constructor() { }
}
