import { DatosLiquidacionIntegrantesItem } from "./DatosLiquidacionIntegrantesItem";
import { ErrorItem } from "./ErrorItem";

export class DatosIntegrantesLiquidacionObject {
  error: ErrorItem;
  datosLiquidacionItem: DatosLiquidacionIntegrantesItem[] = [];
  constructor() {}
}
