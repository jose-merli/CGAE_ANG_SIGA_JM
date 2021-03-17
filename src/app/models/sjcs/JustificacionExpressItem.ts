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

  constructor() { }
}