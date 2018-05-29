import { BusquedaJuridicaItem } from "./BusquedaJuridicaItem";
import { ErrorItem } from "./ErrorItem";
export class BusquedaJuridicaObject {
  error: Error;
  busquedaJuridicaItems: BusquedaJuridicaItem[] = [];
  constructor() {}
}
