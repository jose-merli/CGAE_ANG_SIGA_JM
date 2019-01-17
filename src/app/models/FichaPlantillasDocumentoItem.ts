import { PlantillaDocumentoItem } from "./PlantillaDocumentoItem";
export class FichaPlantillasDocument {
  idInstitucion: String;
  idClaseComunicacion: String;
  idModeloComunicacion: String;
  idPlantillaDocumento: String;
  idIdioma: String;
  formatoSalida: String;
  ficheroSalida: String;
  idSufijo: String[];
  idConsulta: String;
  idFinalidad: String;
  idTipoEjecucion: String;
  idInforme: String;
  plantillas: PlantillaDocumentoItem[]=[];
  constructor() { }
}

