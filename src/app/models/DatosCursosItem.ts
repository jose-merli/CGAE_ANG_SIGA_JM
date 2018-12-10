export class DatosCursosItem {
  idCurso: string;
  visibilidad: string;
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
  descripcion: string;
  temas: string[];
  minimoAsistencia: string;
  lugar: string;
  autovalidacion: string;
  adjunta: string;

  flagArchivado: number;

  constructor() {}
}
