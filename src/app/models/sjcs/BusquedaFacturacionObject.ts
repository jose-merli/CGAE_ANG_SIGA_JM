import { BusquedaFacturacionItem } from "./BusquedaFacturacionItem";

export class BusquedaFacturacionObject {
  error: Error;
  BusquedaFacturacionItem: BusquedaFacturacionItem[] = [];
  onlyNif: Boolean;

  constructor() { }
}