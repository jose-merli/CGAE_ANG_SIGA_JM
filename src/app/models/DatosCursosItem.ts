import { ComboItem } from "./ComboItem";

export class DatosCursosItem {
  idCurso: string;
  visibilidad: string;
  numeroSesiones: number;
  idVisibilidad: string;
  colegio: string;
  codigoCurso: string;
  nombreCurso: string;
  idEstado: string;
  estado: string;
  plazasDisponibles: string;
  nombreApellidosFormador: string;
  precioCurso: string;
  precioDesde: number;
  precioHasta: number;
  fechaInscripcion: String;
  fechaInscripcionDesdeDate: Date;
  fechaInscripcionHastaDate: Date;
  fechaInscripcionDesde: string;
  fechaInscripcionHasta: string;
  fechaImparticion: String;
  fechaImparticionDesdeDate: Date;
  fechaImparticionHastaDate: Date;
  fechaImparticionDesde: string;
  fechaImparticionHasta: string;
  tipo: string;
  descripcionEstado: string;
  temasCombo: ComboItem[];
  temas: string[];
  minimoAsistencia: string;
  lugar: string;
  autovalidacion: boolean;
  adjunto: string;
  adicional: string;
  encuesta: string;
  tipoServicios: String;

  flagArchivado: number;
  autovalidacionInscripcion: string;

  idEventoInicioInscripcion: string;
  idEventoFinInscripcion: string;

  idTipoEvento: string;
  idInstitucion: string;

  aviso: string;
  numTemas: string;

  constructor() { }
}
