import { BusquedaFisicaItem } from "./BusquedaFisicaItem";
import { ErrorItem } from "./ErrorItem";
export class BusquedaFisicaObject {
  error: Error;
  busquedaFisicaItems: BusquedaFisicaItem[] = [];
  onlyNif: Boolean;
  constructor() { }
}
