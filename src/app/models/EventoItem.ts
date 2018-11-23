import { DatosRepeticionEventoItem } from "./DatosRepeticionEventoItem";

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
  idEstadoEvento: string;
  idTipoEvento: string;
  fechaBaja: Date;
  usuModificacion: string;
  fechaModificacion: Date;
  tipoAcceso: number;

  datosRepeticion: DatosRepeticionEventoItem;

  constructor() {}
}
