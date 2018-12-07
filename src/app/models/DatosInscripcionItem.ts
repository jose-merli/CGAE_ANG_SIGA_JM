export class DatosInscripcionItem {
  idCurso: string;
  idInscripcion: string;
  visibilidad: string;
  idVisibilidad: string;
  colegio: string;
  codigoCurso: string;
  nombreCurso: string;
  idEstadoCuso: string;
  idEstadoInscripcion: string;
  estadoCurso: string;
  estadoInscripcion: string;
  certificadoEmitido: string;
  calificacionEmitida: string;
  nombreApellidosFormador: string;
  precioCurso: string;
  fechaInscripcion: Date;
  fechaInscripcionDesde: Date;
  fechaInscripcionHasta: Date;
  fechaImparticion: Date;
  fechaImparticionDesde: Date;
  fechaImparticionHasta: Date;
  tipo: string;
  descripcion: string;
  temas: string[];
  minimaAsistencia: string;
  lugar: string;
  autovalidacion: string;
  adjunta: string;

  flagArchivado: number;
  constructor() {}
}
