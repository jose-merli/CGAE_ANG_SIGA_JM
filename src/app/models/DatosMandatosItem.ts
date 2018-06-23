import { ComboItem } from "./ComboItem";
export class DatosMandatosItem {
  idMandatoProducto: String;
  idMandatoServicio: String;
  idPersona: String;
  idInstitucion: String;
  idCuenta: String;
  referenciaProducto: String;
  esquemaProducto: String;
  tipoPagoProducto: String;
  referenciaServicio: String;
  esquemaServicio: String;
  tipoPagoServicio: String;
  combooItems: ComboItem[];
  status: String;

  constructor() {}
}
