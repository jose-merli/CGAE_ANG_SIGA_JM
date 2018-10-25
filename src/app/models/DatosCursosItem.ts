export class DatosCursosItem {
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
  temas: string[];

  flagArchivado: number;

  constructor() {}
}
