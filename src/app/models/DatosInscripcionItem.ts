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
  certificadoEmitido: number;
  emitirCertificado: number;
  isCertificadoAutomatico: boolean;
  calificacion: string;
  nombreApellidosFormador: string;
  idFormador: string;
  precioCurso: string;
  fechaInscripcion: Date;
  fechaInscripcionDesde: Date;
  fechaInscripcionHasta: Date;
  fechaImparticion: Date;
  fechaImparticionDesde: Date;
  fechaImparticionHasta: Date;
  fechaImparticionDesdeFormat: String;
  fechaImparticionHastaFormat: String;
  tipo: string;
  descripcion: string;
  temas: string[];
  minimaAsistencia: string;
  checkMinimaAsistencia: boolean;
  lugar: string;
  autovalidacion: string;
  adjunta: string;
  motivo: string;
  tipoAccion: string;
  pagada: string;
  fechaSolicitud: Date;
  fechaSolicitudDate: Date;
  idPersona: string;
  idInstitucion: string;

  editar: boolean;
  flagArchivado: number;
  numeroSesiones: number;
  canceladas: string;
  aprobadas: string;
  rechazadas: string;
  pendientes: string;
  totales: string;

  idEstadoCurso: string;

  constructor() {}
}
