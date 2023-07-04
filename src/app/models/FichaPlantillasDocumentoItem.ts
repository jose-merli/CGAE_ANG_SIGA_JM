import { PlantillaDocumentoItem } from "./PlantillaDocumentoItem";
import { ConsultasPlantillasInformesItem } from "./ConsultasPlantillasInformes";
import { SufijoItem } from "./SufijoItem";
export class FichaPlantillasDocument {
  idInstitucion: String;
  idClaseComunicacion: String;
  idModeloComunicacion: String;
  idPlantillaDocumento: String;
  idIdioma: String;
  formatoSalida: String;
  idFormatoSalida: String;
  nombreFicheroSalida: String;
  idSufijo: String[];
  idFinalidad: String;
  idTipoEjecucion: String;
  idInforme: String;
  plantillas: PlantillaDocumentoItem[] = [];
  consultas: ConsultasPlantillasInformesItem[] = [];
  sufijos: SufijoItem[] = [];
  generacionExcel:number;  
  constructor() { }
}


