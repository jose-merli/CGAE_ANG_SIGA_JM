import { ErrorItem } from "./ErrorItem";

export class CargaMasivaItem {
  nombreFichero: String;
  usuario: String;
  registros: String;
  fechaCarga: String;
  tipoCarga: String;
  errores: ErrorItem;
  constructor() {}
}
