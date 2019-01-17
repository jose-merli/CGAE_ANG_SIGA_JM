import { PlantillaDocumentoItem } from "./PlantillaDocumentoItem";
export class FichaPlantillasDocument {
  idInstitucion: String;
  idClaseComunicacion: String;
  idModeloComunicacion: String;
  idPlantillaDocumento: String;
  idIdioma: String;
  idFormato: String;
  nombreFichero: String;
  idSufijo: String[];
  idConsulta: String;
  idFinalidad: String;
  idTipoEjecucion: String;
  plantillas: PlantillaDocumentoItem[]=[];
  constructor() { }
}

