export class BusquedaSancionesItem {
  nif: String;
  nombre: String;
  apellidos: String;
  primerApellido: String;
  segundoApellido: String;
  colegio: String;
  tipoSancion: String;
  refColegio: String;
  refConsejo: Date;
  sancionesRehabilitadas: boolean;
  fecha: Date;
  fechaDesde: Date;
  fechaHasta: Date;
  sancionesArchivadas: boolean;
  fechaArchivadaDesde: Date;
  fechaArchivadaHasta: Date;
  tipo: String;
  origen: String;
  estado: String;
  constructor() {}
}
