export class EventoItem {
  idEvento: string;
  idCalendario: string;
  allDay: boolean = true;
  color: string;
  idInstitucion: string;
  titulo: string;

  start: Date;
  end: Date;
  startRepeat: Date;
  endRepeat: Date;

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
