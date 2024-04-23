import { JusticiableTelefonoObject } from './JusticiableTelefonoObject';
import { JusticiableTelefonoItem } from './JusticiableTelefonoItem';
export class JusticiableItem {

  idpersona: string;
  idinstitucion: string;
  nif: string;
  nombre: string;
  asuntos: string;
  fechamodificacion: Date;
  fechanacimiento: Date;
  idpais: string;
  apellidos: string;
  apellido1: string;
  apellido2: string;
  direccion: string;
  codigopostal: string;
  idprofesion: string;
  regimenConyugal: string;
  idprovincia: string;
  idpoblacion: string;
  idestadocivil: string;
  tipopersonajg: string;
  idtipoidentificacion: string;
  observaciones: string;
  idrepresentantejg: number;
  idtipoencalidad: string;
  sexo: string;
  idlenguaje: string;
  numerohijos: string;
  fechaalta: Date;
  fax: string;
  correoelectronico: string;
  edad: string;
  idminusvalia: string;
  existedomicilio: string;
  idprovincia2: string;
  idpoblacion2: string;
  direccion2: string;
  codigopostal2: string;
  idtipodir: string;
  idtipodir2: string;
  cnae: string;
  idtipovia: string;
  numerodir: string;
  escaleradir: string;
  pisodir: string;
  puertadir: string;
  idtipovia2: string;
  numerodir2: string;
  escaleradir2: string;
  idtipopersona: string;
  pisodir2: string;
  puertadir2: string;
  idpaisdir1: string;
  idpaisdir2: string;
  descpaisdir1: string;
  descpaisdir2: string;
  idtipoidentificacionotros: string;
  asistidosolicitajg: string;
  asistidoautorizaeejg: string;
  autorizaavisotelematico: string;
  direccionNoInformada: boolean = false;
  numeroAsuntos: string;
  ultimoAsunto: string;

  telefonos: JusticiableTelefonoItem[];

  representante: number;
  parentesco: string;
  tipojusticiable: string;

  datosAsuntos: any[];
  validacionRepeticion: boolean;
  asociarRepresentante: boolean;
  constructor() { }
}