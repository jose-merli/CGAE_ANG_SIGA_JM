export class DatosBancariosItem {
  idPersona: String;
  idInstitucion: String;
  nifTitular: String;
  idCuentas: String[];
  idCuenta: String;
  id: String;
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
  status: String;
  revisionCuentas: boolean;
  motivo: String;
  denominacion: String;
  fechaModificacion: Date;
  constructor() { }
}
