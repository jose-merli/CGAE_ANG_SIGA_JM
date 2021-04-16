export class CalendariosDatosEntradaItem{

  turno: string;
  guardia: string;
  idTurno: string;
  idGuardia: string;
  observaciones: string;
  fechaDesde: string;
	fechaHasta: string;
	fechaProgramacion: string;
	estado: string;
	generado: string;
	numGuardias: string;
  idCalG: string;
  listaGuardias: string;
  idCalendarioProgramado: string;
  constructor(obj: Object) {
    
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
  }
}


