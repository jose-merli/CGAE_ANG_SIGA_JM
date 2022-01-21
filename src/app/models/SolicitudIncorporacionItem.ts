import { DocumentacionIncorporacionItem } from "./DocumentacionIncorporacionItem";

export class SolicitudIncorporacionItem {
  idSolicitud: String;
  estadoMutualidad: String;
  idSolicitudMutualidad: String;
  numeroIdentificacion: String;
  identificador: String;
  nombreSolicitud: String;
  nombrePoblacion: String;
  soloNombre: String;
  apellidos: String;
  apellido1: String;
  idPersona: String;
  idsolicitudincorporacion: String;
  apellido2: String;
  sexo: String;
  cobertura: String;
  duplicado: boolean;
  fechaNacimiento: Date;
  fechaNacimientoStr: any;
  fechaNacimientoString: string;
  numColegiado: String;
  fechaSolicitud: Date;
  fechaEstado: Date;
  estadoSolicitud: String;
  tipoSolicitud: String;
  fechaDesde: Date;
  fechaHasta: Date;
  nombre: String;
  modalidad: String;
  idModalidadDocumentacion: String;
  idEstado: String;
  idTipo: String;
  tipoColegiacion: String;
  tipoIdentificacion: String;
  idTipoIdentificacion: String;
  idTipoColegiacion: String;
  idTratamiento: String;
  observaciones: String;
  fechaIncorporacion: Date;
  residente: String;
  naturalDe: String;
  tratamiento: String;
  estadoCivil: String;
  idEstadoCivil: String;
  pais: String;
  idPais: String;
  domicilio: String;
  telefono1: String;
  telefono2: String;
  bic: String;
  fax1: String;
  fax2: String;
  movil: String;
  correoElectronico: String;
  codigoPostal: String;
  idPoblacion: String;
  idProvincia: String;
  nombreProvincia: String;
  titular: String;
  iban: String;
  abonoCargo: String;
  abonoJCS: String;
  cboCodigo: String;
  codigoSucursal: String;
  digitoControl: String;
  numeroCuenta: String;
  banco: String;
  idInstitucion: String;
  poblacionExtranjera: string;
  fechaEstadoSolicitud: Date;


  idestadocivil;
  idtipoidentificacion: string;
  numeroidentificador: string;
  idtratamiento: string;
  idsolicitud: string;
  naturalde: string;
  nombreBanco: string;

  numRegistro : string;
  documentos : DocumentacionIncorporacionItem [];

  constructor() { }
}
