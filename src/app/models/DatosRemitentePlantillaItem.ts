import { DatosDireccionesItem } from './DatosDireccionesItem'

export class DatosRemitentePlantillaItem {
  idConsulta: String;
  idPlantillaEnvios: String;
  idTipoEnvios: String;
  idInstitucion: String;
  idEnvio: String;
  idPersona: String;
  nombre: String;
  apellido1: String;
  apellido2: String;
  fechaModificacion: Date;
  fechaProgramada: Date;
  usuModificacion: String;
  descripcion: String;
  direccion: DatosDireccionesItem[] = [];
  idPoblacion: String;
  idProvincia: String;
  idPais: String;
  codigoPostal: String;
  telefono: String;
  fax: String;
  movil: String;
  correoElectronico: String;
  poblacionExtranjera: String;
  fax1: String;
  fax2: String;

  constructor() { }
}
