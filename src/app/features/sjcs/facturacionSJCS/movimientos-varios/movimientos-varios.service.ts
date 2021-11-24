import { Injectable } from '@angular/core';
import { ColegiadosSJCSItem } from '../../../../models/ColegiadosSJCSItem';

@Injectable()
export class MovimientosVariosService {

  modoEdicion: boolean;
  datosColegiadoAux: ColegiadosSJCSItem = null;

  constructor() { }

}
