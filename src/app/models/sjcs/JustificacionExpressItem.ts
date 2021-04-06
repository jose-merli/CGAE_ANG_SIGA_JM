export class JustificacionExpressItem {
  
  nColegiado: String;
  nombre: String;
  apellidos: String;
  anioEJG: String;
  NumEJG: String;
  muestraPendiente: boolean;
  restriccionesVisualizacion: boolean;
  justificacionDesde: Date;
  justificacionHasta: Date;
  estado: String;
  actuacionesValidadas: String;
  sinEJG: String;
  conEJGNoFavorables: String;
  ejgSinResolucion: String;
  resolucionPTECAJG: String;
  designacionDesde: Date;
  designacionHasta: Date;
  anioDesignacion: String;
  numDesignacion: String;
  codigoDesignacion: String;
  expedientes: String;
	cliente: String;
	art27: String;
	nig: String;
	idJuzgado: String;
	nombreJuzgado: String;
	idInstitucionJuzgado: number;
	anioProcedimiento: number;
	numProcedimiento: String;
	fechaJustificacion: Date;
	fechaActuacion: Date;
	fechaDesignacion: Date;
	resolucionDesignacion: String;
	idInstitucion: String;
	idTurno: String;
  idPersona: String;
  idProcedimiento: String;

  constructor() { }
}