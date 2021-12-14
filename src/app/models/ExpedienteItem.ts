import { DocumentacionAsistenciaItem } from "./guardia/DocumentacionAsistenciaItem";
import { HistoricoExpedienteItem } from "./HistoricoExpedienteItem";

export class ExpedienteItem {
  idExpedienteEXEA : string;
  idTipoExpediente : string;
  anioExpediente : string;
  tipoExpediente: string;
  numExpediente: string;
  estadoExpediente: string;
  fechaApertura: string;
  relacion: string;
  idInstitucionTipoExpediente : string;
  descInstitucion : string;
  documentos : DocumentacionAsistenciaItem [];
  hitos : HistoricoExpedienteItem [];
  numRegistro : string;
  fechaRegistro : string;
  exea: boolean;
  titular : string;
  constructor(){}
}
  