import { ErrorItem } from "./ErrorItem";

export class CargaMasivaItem {
  nombreFichero: String;
  usuario: String;
  registrosCorrectos: number;
  fechaCarga: String;
  tipoCarga: String;
  errores: ErrorItem;
  idFichero: number;
  idFicheroLog: number;
  registrosErroneos: number;
  constructor() {}
}
