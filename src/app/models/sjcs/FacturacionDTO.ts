import { FacturacionItem } from "./FacturacionItem";

export class FacturacionDTO {
  error: Error;
  FacturacionItem: FacturacionItem[] = [];

  constructor() { }
}