export class CalendariosDatosEntradaItem{
  soloGenerarVacio:string;
  contadorGenerados: number;
  idInstitucion: string;
  turno: string;
  guardia: string;
  idTurno: string;
  idGuardia: string;
  observaciones: string;
  fechaDesde: string;
	fechaHasta: string;
	fechaProgramacion: Date;
	estado: string;
	generado: string;
	numGuardias: string;
  idCalG: string;
  listaGuardias: string;
  idCalendarioProgramado: string;
  facturado: boolean;
  asistenciasAsociadas: boolean;
  idCalendarioGuardias: string;
  estadoProgramacion:string;
  constructor(obj: Object) {
    this.estadoProgramacion = obj['estadoProgramacion']
    this.soloGenerarVacio = obj['soloGenerarVacio']
    this.contadorGenerados = obj['contadorGenerados']
    this.idInstitucion = obj['idInstitucion']
    this.idCalendarioProgramado = obj['idCalendarioProgramado'];
    this.guardia = obj['guardia'];
    this.turno = obj['turno'];
    this.idGuardia = obj['idGuardia'];
    this.idTurno = obj['idTurno'];
    this.fechaDesde = obj['fechaDesde'];
    this.fechaHasta= obj['fechaHasta'];
    this.observaciones = obj['observaciones'];
    this.fechaProgramacion = obj['fechaProgramacion'];
    this.estado = obj['estado'];
    this.generado = obj['generado'];
    this.numGuardias = obj['numGuardias'];
    this.idCalG = obj['idCalG'];
    this.listaGuardias = obj['listaGuardias'];
    this.facturado = obj['facturado'];
    this.asistenciasAsociadas = obj['asistenciasAsociadas'];
    this.idCalendarioGuardias = obj['idCalendarioGuardia'];
  }
}


