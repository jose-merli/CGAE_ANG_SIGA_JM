import { FacturacionItem } from "./FacturacionItem";

export class TramitarCerttificacionRequestDTO {
    idCertificacion: string;
    facturacionItemList: FacturacionItem[] = [];
}