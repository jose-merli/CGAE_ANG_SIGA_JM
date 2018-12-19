export class EnviosMasivosItem {
  idClaseComunicacion: String;
  idEnvio: String;
  fechaCreacion: Date;
  idPlantillasEnvio: String;
  idEstado: String;
  idTipoEnvios: String;
  nombrePlantilla: String;
  fechaProgramada: Date;
  fechaBaja: Date;
  asunto: String;
  cuerpo: String;
  idGrupo: String;
  idEnvioDelete: String[] = [];
  estadoEnvio: String;

  constructor() { }
}
