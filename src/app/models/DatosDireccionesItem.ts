import { ComboItem } from "./ComboItem";
export class DatosDireccionesItem {
  idPersona: String;
  // idDireccion: String;
  // tipoDireccion: String;
  // direccion: String;
  // codigoPostal: String;
  // poblacion: String;
  // telefono: String;
  // movil: String;
  // fax: String;
  // email: String;
  // provincia: String;
  // otraProvincia: boolean;
  // pais: String;
  // comboTipoDireccion: ComboItem;
  // fechaModificacion: Date;
  // contacto: String;
  // tipoContacto: ComboItem;

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
  constructor() {}
}
