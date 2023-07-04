import { BusquedaJuridicaItem } from "./BusquedaJuridicaItem";
import { ErrorItem } from "./ErrorItem";
import { CalendarItem } from "./CalendarItem";

export class CalendarObject {
  error: Error;
  calendarItems: CalendarItem[] = [];
  calendar: CalendarItem;
  constructor() { }
}
