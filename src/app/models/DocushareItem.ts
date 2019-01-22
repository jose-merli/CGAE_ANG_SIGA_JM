import { SolicitudIncorporacionItem } from "./SolicitudIncorporacionItem";
import { ErrorItem } from "./ErrorItem";
export class DocushareItem {
  id: String;
  title: String;
  description: String;
  tipo: String;
  fechaModificacion: Date;
  sizeKB: String;
  summary: String;
  originalFilename: String;
  idPersona:String;
  parent: String;
  constructor() {}
}
// export enum DocuShareTipo {
//   COLLECTION,
//   DOCUMENT
// }
