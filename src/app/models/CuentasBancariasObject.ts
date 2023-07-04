import { CuentasBancariasItem } from "./CuentasBancariasItem";
import { ErrorItem } from "./ErrorItem";
export class CuentasBancariasObject {
  error: ErrorItem;
  datosBancariosItem: CuentasBancariasItem[] = [];
  constructor() {}
}