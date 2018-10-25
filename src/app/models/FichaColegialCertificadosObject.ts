import { FichaColegialCertificadosItem } from "./FichaColegialCertificadosItem";
import { ErrorItem } from "./ErrorItem";
export class FichaColegialCertificadosObject {
  error: ErrorItem;
  certificadoItem: FichaColegialCertificadosItem[] = [];
  constructor() {}
}
