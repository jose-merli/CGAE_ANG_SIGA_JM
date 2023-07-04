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
  idColegio: String;
  tipoSancion: String;
  refConsejo: String;
  refColegio: String;

  chkRehabilitado: boolean;
  rehabilitado: String;
  fecha: Date;
  fechaAcuerdoHasta: Date;
  fechaDesde: String;
  fechaDesdeDate: Date;
  fechaHasta: String;
  fechaHastaDate: Date;
  chkArchivadas: boolean;
  chkAcuerdo: boolean;
  fechaArchivadaDesde: String;
  fechaArchivadaDesdeDate: Date;
  fechaArchivadaHasta: String;
  fechaArchivadaHastaDate: Date;

  fechaFirmezaDesdeDate: Date;
  fechaFirmezaHastaDate: Date;
  fechaImposicionDesdeDate: Date;
  fechaImposicionHastaDate: Date;
  fechaRehabilitadoDesdeDate: Date;
  fechaRehabilitadoHastaDate: Date;
  fechaResolucionDesdeDate: Date;
  fechaResolucionHastaDate: Date;

  // Búsqueda por Sanciones
  tipo: String;
  origen: String;
  estado: String;
  fechaAcuerdo: String;
  fechaAcuerdoDate: Date;
  fechaArchivada: String;
  fechaArchivadaDate: Date;
  archivada: String;
  chkFirmeza: boolean;
  fechaFirmeza: String;
  fechaFirmezaDate: Date;
  firmeza: String;
  fechaRehabilitado: String;
  fechaRehabilitadoDate: Date;

  fechaNacimiento: String;
  fechaNacimientoDate: Date;
  texto: String;
  observaciones: String;
  idPersona: String;
  idInstitucionS: String;

  tipoFecha: String;

  numExpediente: String;

  restablecer: boolean;

  constructor() { }
}
