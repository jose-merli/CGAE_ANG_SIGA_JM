export class DatosLiquidacionIntegrantesItem {
  idPersona: String;
  idInstitucion: String;
  idComponente: String;
  fechaInicio: Date = undefined;
  fechaFin: Date;
  idHistorico: String;
  sociedad: String;
  observaciones: String;
  fechaModificacion: Date;
  usuModificacion: number;
  anterior: boolean;
  nuevo: boolean;
  constructor() { }
}
