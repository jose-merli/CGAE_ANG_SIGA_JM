export class EventoItem {
  idEvento: string;
  idCalendario: string;
  allDay: boolean = true;
  color: string;
  idInstitucion: string;
  title: string;

  start: Date;
  end: Date;
  fechaInicioOld: Date;
  lugar: string;
  descripcion: string;
  descripcionOld: string;
  recursos: string;
  idTipoCalendario: string;
  tipoCalendario: string;
  idEstadoEvento: string;
  estado: string;
  idTipoEvento: string;
  tipoEvento: string;
  fechaBaja: Date;
  usuModificacion: string;
  fechaModificacion: Date;
  tipoAcceso: number;

  idRepeticionEvento: String;
  valoresRepeticion: number[];
  valoresRepeticionString: string;
  tipoDiasRepeticion: String;
  tipoRepeticion: String;
  fechaInicioRepeticion: Date;
  fechaFinRepeticion: Date;
  idCurso: string;

  estadoEvento: string;
  fechaInicioString: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;

  formadores: string;
  idEventoOriginal: string;
  anio: string;
  fiestaLocalPartido: string;
  historico: boolean;
  nombre: string;

  constructor() { }
}
