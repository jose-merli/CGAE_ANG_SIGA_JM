export class EventoItem {
  idEvento: string;
  idCalendario: string;
  allDay: boolean = true;
  color: string;
  idInstitucion: string;
  title: string;

  start: Date;
  end: Date;
  lugar: string;
  descripcion: string;
  recursos: string;
  idTipoCalendario: string;
  idEstadoEvento: string;
  idTipoEvento: string;
  fechaBaja: Date;
  usuModificacion: string;
  fechaModificacion: Date;
  tipoAcceso: number;

  idRepeticionEvento: String;
  valoresRepeticion: number[];
  valoresRepeticionString: String;
  tipoDiasRepeticion: String;
  tipoRepeticion: String;
  fechaInicioRepeticion: Date;
  fechaFinRepeticion: Date;
  idCurso: string;

  estadoEvento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;

  constructor() {}
}
