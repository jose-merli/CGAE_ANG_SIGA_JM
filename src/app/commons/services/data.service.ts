import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarioObject {
  listadoGuardia: any,
  fechaDesde: any,
  fechaHasta: any,
  fechaProgramada: any,
  observaciones: any,
}

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject({
    listadoGuardia: '',
    fechaDesde: null,
    fechaHasta: null,
    fechaProgramada: null,
    observaciones: '',
  });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: CalendarioObject) {
    this.messageSource.next(message)
  }

}
