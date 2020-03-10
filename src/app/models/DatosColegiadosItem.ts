import { ComboEtiquetasItem } from "./ComboEtiquetasItem";
import { ComboSituacionResidenteItem } from "./ComboSituacionResidenteItem";
import { ComboItemColegiado } from "./ComboItemColegiado";

export class DatosColegiadosItem {
  numColegiado: string;
  nif: string;
  nombre: string;
  apellidos: string;
  institucion: string;
  idProvincia: string;
  idPoblacion: string;
  idInstitucion: string;
  codigoPostal: string;
  telefono: string;
  movil: string;
  tipoDireccion: string;
  numberColegiado: number;
  sexo: string;
  incorporacionDate: Date;
  estadoCivil: string;
  estadoColegial: string;
  fechaIncorporacion: Date[];
  fechaNacimientoRango: Date[];
  categoria: string;
  residencia: string;
  situacion: string;
  situacionResidente: string;
  situacionresidente: ComboItemColegiado;
  inscrito: string;
  residenteInscrito: string;
  correo: string;
  fechaNacimiento: string;
  fechaNacimientoDate: Date;
  idPersona: string;
  idgrupo: string[];
  idTratamiento: String;
  tipoCV: string;
  denominacion: string;

  idLenguaje: string;
  soloNombre: string;
  apellidos1: string;
  apellidos2: string;
  idTipoIdentificacion: string;
  naturalDe: string;
  asientoContable: string;
  nMutualista: string;
  idTiposSeguro: string;
  incorporacion: String;
  fechaJura: Date;
  fechaTitulacion: Date;
  comisiones: string;
  partidoJudicial: string;
  subtipoCV: string[];

  idEstadoCivil: string;

  subTipoCV1: string;
  subTipoCV2: string;

  noAparecerRedAbogacia: string;
  noAparecerRedAbogacia2: string;
  colegioResultado: string;

  //Filtro Busqueda de colegios
  colegio: string[];
  identificadords: string;
  noAparecerRedAbogaciaFilter: string;
  searchCount: boolean;
  count: string;
  situacionResidenteFilter: string;
  constructor() { }
}
