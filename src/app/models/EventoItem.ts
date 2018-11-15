export class EventoItem {
  idEvento: string;
  idCalendario: string;
  start: string;
  end: string;
  allDay: boolean = true;
  color: string;

  idInstitucion: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  lugar: string;
  descripcion: string;
  recursos: string;
  idEstadoEvento: string;
  idTipoEvento: string;
  fechaBaja: Date;
  usuModificacion: string;
  fechaModificacion: Date;

  constructor() {}
}
