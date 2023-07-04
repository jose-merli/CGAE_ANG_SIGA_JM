import { ErrorItem } from "./ErrorItem";

export class CargaMasivaItem {
  nombreFichero: String;
  usuario: String;
  registrosCorrectos: number;
  fechaCarga: String;
  fechaCargaDesde : String;
  fechaCargaHasta : String;
  fechaSolicitudDesde: String;
  tipoCarga: String;
  errores: ErrorItem;
  idFichero: number;
  idFicheroLog: number;
  registrosErroneos: number;
  constructor() {}
}
