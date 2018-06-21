export class DatosBancariosItem {
  idPersona: String;
  idInstitucion: String;
  nifTitular: String;
  idCuentas: String[];
  idCuenta: String;
  titular: String;
  iban: String;
  bic: String;
  uso: String;
  fechaFirmaServicios: Date;
  fechaFirmaProductos: Date;
  fechaBaja: Date;
  historico: boolean;
  banco: String;
  tipoCuenta: String[];
  cuentaContable: String;
  // referenciaProducto: String;
  // esquemaProducto: String;
  // tipoPagoProducto: String;
  // referenciaServicio: String;
  // esquemaServicio: String;
  // tipoPagoServicio: String;

  constructor() {}
}
