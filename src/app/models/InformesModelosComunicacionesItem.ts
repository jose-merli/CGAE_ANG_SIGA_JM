import { SufijoItem } from "./SufijoItem";
export class InformesModelosComItem {
  idioma: String;
  nombreFicheroSalida: String;
  sufijo: String;
  formatoSalida: String;
  destinatarios: String;
  condicion: String;
  multidocumento: String;
  datos: String;
  idInforme: String;
  idFormatoSalida: String;
  sufijos: SufijoItem[] = [];
  constructor() { }
}
