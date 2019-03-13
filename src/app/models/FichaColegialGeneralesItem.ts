import { ErrorItem } from "./ErrorItem";
import { ComboItem } from "./ComboItem";
export class FichaColegialGeneralesItem {
  searchLoggedUser: Boolean;
  idPersona: String;
  nif: String;
  soloNombre: String;
  idInstitucion: String;
  colegiado: Boolean;
  idTipoIdentificacion: String;
  imagenCambiada: Boolean;
  nombre: String;
  apellidos1: String;
  apellidos2: String;
  sexo: String;
  idTratamiento: String;
  tratamiento: String;
  naturalDe: String;
  idEstadoCivil: String;
  estadoColegial: String;
  idLenguaje: String;
  situacion: String;
  fechaIncorporacionDate: Date;
  incorporacionDate: Date;
  fechaNacimientoDate: Date;
  fechaIncorporacion: Date;
  incorporacion: Date;
  fechaNacimiento: Date;
  idioma: String;
  motivo: String;
  asientoContable: String;
  partidoJudicial: any;
  noAparecerRedAbogacia: String;
  comisiones: String;
  grupos: any[];
  etiquetas: any[];
  fechaBajaEtiq: Date;
  fechaInicioEtiq: Date;
  error: ErrorItem;
  fechaBaja: string;
  temasCombo: ComboItem[];
  temas: string[];
  numColegiado: String;
  
  constructor() {}
}
