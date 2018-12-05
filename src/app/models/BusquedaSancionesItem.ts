export class BusquedaSancionesItem {
  // Búsqueda por Letrado
  nif: String;
  multa: String;
  nombre: String;
  primerApellido: String;
  segundoApellido: String;

  // Búsqueda por Colegio
  colegio: String;
  idColegios: String[];
  tipoSancion: String;
  refConsejo: String;
  refColegio: String;

  chkRehabilitado: boolean;
  rehabilitado: String;
  fecha: Date;
  fechaDesde: Date;
  fechaHasta: Date;
  chkArchivadas: boolean;
  chkAcuerdo: boolean;
  fechaArchivadaDesde: Date;
  fechaArchivadaHasta: Date;

  // Búsqueda por Sanciones
  tipo: String;
  origen: String;
  estado: String;
  fechaAcuerdo: Date;
  fechaArchivada: Date;
  chkFirmeza: boolean;
  fechaFirmeza: Date;
  firmeza: String;
  fechaRehabilitado: Date;

  constructor() {}
}
