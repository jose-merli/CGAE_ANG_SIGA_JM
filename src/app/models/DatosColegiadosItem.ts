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
  codigoPostal: string;
  telefono: string;
  movil: string;
  tipoDireccion: string;
  numberColegiado: number;
  sexo: string;
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
  incorporacion: Date;
  fechaJura: Date;
  fechaTitulacion: Date;
  comisiones: string;
  partidoJudicial: string;
  subtipoCV: string[];

  idEstadoCivil: string;

  subTipoCV1: string;
  subTipoCV2: string;

  constructor() {}
}