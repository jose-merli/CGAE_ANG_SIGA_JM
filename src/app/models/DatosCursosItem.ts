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
  fechaInscripcionDesde: Date;
  fechaInscripcionHasta: Date;
  fechaImparticion: String;
  fechaImparticionDesde: Date;
  fechaImparticionHasta: Date;
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
