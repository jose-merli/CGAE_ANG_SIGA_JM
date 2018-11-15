export class BusquedaSancionesItem {
  // nif: String;
  // nombre: String;
  // primerApellido: String;
  // segundoApellido: String;
  // colegio: String;
  // tipoSancion: String;
  // refColegio: String;
  // refConsejo: String;
  // chkRehabilitado: boolean;
  // fechaRehabilitado: Date;
  // fecha: Date;
  // fechaDesde: Date;
  // fechaHasta: Date;
  // chkArchivada: boolean;
  // fechaArchivada: Date;
  // fechaArchivadaDesde: Date;
  // fechaArchivadaHasta: Date;
  // tipo: String;
  // origen: String;
  // estado: String;
  // chkFirmeza: boolean;
  // fechaFirmeza: Date;
  // fechaAcuerdo: Date;
  // multa: String;
  // texto: String;
  // observaciones: String;

  // Búsqueda por Letrado
  nif: String;
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
  fechaArchivadaDesde: Date;
  fechaArchivadaHasta: Date;

  // Búsqueda por Sanciones
  tipo: String;
  origen: String;
  estado: String;

  chkFirmeza: boolean;
  firmeza: String;

  constructor() {}
}
