export class BusquedaSancionesItem {
  // Búsqueda por Letrado
  nif: string;
  multa: string;
  nombre: string;
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

  // Búsqueda por Sanciones
  tipo: string;
  origen: string;
  estado: string;
  fechaAcuerdo: string;
  fechaAcuerdoDate: Date;
  fechaArchivada: string;
  fechaArchivadaDate: Date;
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
  constructor() {}
}
