export class EnviosMasivosItem {
  idInstitucion: String;
  idEnvio: String;
  fechaCreacion: Date;
  idPlantillasEnvios: String;
  idEstado: String;
  idTipoEnvios: String;
  idPlantilla: String;
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
