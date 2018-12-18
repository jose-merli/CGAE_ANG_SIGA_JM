
export class ProgComunicacionItem {
  idInstitucion: String;
  idEnvio: String;
  fechaCreacion: Date;
  idPlantillasEnvio: String;
  idEstado: String;
  idTipoEnvio: String;
  nombrePlantilla: String;
  fechaProgramada: Date;
  fechaBaja: Date;
  asunto: String;
  cuerpo: String;
  idGrupo: String;
  idEnvioDelete: String[] = [];
  estadoEnvio: String;
  descripcion: String;
  constructor() { }
}
