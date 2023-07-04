export class EnviosMasivosItem {
  idInstitucion: String;
  idEnvio: String;
  descripcion: String;
  fechaCreacion: Date;
  idPlantillaEnvios: String;
  idEstado: String;
  idTipoEnvios: String;
  tipoEnvio: String;
  idPlantilla
  nombrePlantilla: String;
  fechaProgramada: Date;
  fechaBaja: Date;
  asunto: String;
  cuerpo: String;
  idGrupo: String;
  idEnvioDelete: String[] = [];
  estadoEnvio: String;
  idModeloComunicacion: String;
  idClaseComunicacion: String;
  modeloComunicacion: String;
  claseComunicacion: String;
  csv: String;
  destinatario: String;
  numDestinatarios: String;

  constructor() { }
}