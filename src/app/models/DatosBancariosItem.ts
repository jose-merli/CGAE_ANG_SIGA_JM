export class DatosBancariosItem {
  idPersona: String;
  nif: String;
  idCuenta: String[];
  titular: String;
  iban: String;
  bic: String;
  uso: String;
  fechaFirmaServicios: Date;
  fechaFirmaProductos: Date;
  fechaBaja: Date;
  historico: boolean;

  constructor() {}
}
