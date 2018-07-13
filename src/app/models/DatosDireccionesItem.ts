import { ComboItem } from "./ComboItem";
export class DatosDireccionesItem {
  idPersona: String;
  fechaModificacion: Date;
  fechaBaja: String;
  tipoDireccion: String;
  idTipoDireccion: String[];
  idDireccion: String;
  codigoPostal: String;
  domicilio: String;
  domicilioLista: String;
  idPoblacion: String;
  idProvincia: String;
  idPais: String;
  telefono: String;
  fax: String;
  movil: String;
  correoElectronico: String;
  idExternoPais: String;
  nombrePais: String;
  idExternoPoblacion: String;
  nombrePoblacion: String;
  idExternoProvincia: String;
  nombreProvincia: String;
  paginaWeb: String;
  historico: boolean = false;
  otraProvincia: String;
  motivo: String;
  constructor() {}
}
