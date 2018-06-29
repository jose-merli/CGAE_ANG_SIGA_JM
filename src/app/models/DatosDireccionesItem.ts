import { ComboItem } from "./ComboItem";
export class DatosDireccionesItem {
  idPersona: String;
  idDireccion: String;
  tipoDireccion: String;
  direccion: String;
  codigoPostal: String;
  poblacion: String;
  telefono: String;
  movil: String;
  fax: String;
  email: String;
  provincia: String;
  otraProvincia: boolean;
  //pais: ComboItem;
  pais: String;
  comboTipoDireccion: ComboItem;
  fechaModificacion: Date;
  contacto: String;
  tipoContacto: ComboItem;

  constructor() {}
}
