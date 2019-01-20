import { PlantillaDocumentoItem } from "./PlantillaDocumentoItem";
import { ConsultasPlantillasInformesItem } from "./ConsultasPlantillasInformes";
export class FichaPlantillasDocument {
  idInstitucion: String;
  idClaseComunicacion: String;
  idModeloComunicacion: String;
  idPlantillaDocumento: String;
  idIdioma: String;
  formatoSalida: String;
  nombreFicheroSalida: String;
  idSufijo: String[];
  idFinalidad: String;
  idTipoEjecucion: String;
  idInforme: String;
  plantillas: PlantillaDocumentoItem[] = [];
  consultas: ConsultasPlantillasInformesItem[] = [];
  constructor() { }
}


