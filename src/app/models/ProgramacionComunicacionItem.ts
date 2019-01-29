
export class ProgComunicacionItem {
  idInstitucion: String;
  idEnvio: String;
  fechaCreacion: Date;
  idPlantillaEnvios: String;
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
  descripcion: String;
  constructor() { }
}
