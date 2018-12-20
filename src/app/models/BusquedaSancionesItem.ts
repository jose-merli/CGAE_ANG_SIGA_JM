export class BusquedaSancionesItem {
  // Búsqueda por Letrado
  nif: string;
  multa: string;
  nombre: String;
  primerApellido: string;
  segundoApellido: string;

  // Búsqueda por Colegio
  colegio: string;
  idColegios: String[];
  idColegio: string;
  tipoSancion: string;
  refConsejo: string;
  refColegio: string;

  chkRehabilitado: boolean;
  rehabilitado: string;
  fecha: Date;
  fechaAcuerdoHasta: Date;
  fechaDesde: string;
  fechaDesdeDate: Date;
  fechaHasta: string;
  fechaHastaDate: Date;
  chkArchivadas: boolean;
  chkAcuerdo: boolean;
  fechaArchivadaDesde: string;
  fechaArchivadaDesdeDate: Date;
  fechaArchivadaHasta: string;
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
  tipo: string;
  origen: string;
  estado: string;
  fechaAcuerdo: string;
  fechaAcuerdoDate: Date;
  fechaArchivada: string;
  fechaArchivadaDate: Date;
  archivada: string;
  chkFirmeza: boolean;
  fechaFirmeza: string;
  fechaFirmezaDate: Date;
  firmeza: string;
  fechaRehabilitado: string;
  fechaRehabilitadoDate: Date;

  fechaNacimiento: string;
  fechaNacimientoDate: Date;
  texto: string;
  observaciones: string;
  idPersona: string;
  idInstitucionS: string;

  tipoFecha: string;

  restablecer: boolean;

  constructor() {}
}
