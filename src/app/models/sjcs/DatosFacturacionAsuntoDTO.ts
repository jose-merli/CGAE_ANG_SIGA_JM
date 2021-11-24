import { DatosPagoAsuntoDTO } from "./DatosPagoAsuntoDTO";

export class DatosFacturacionAsuntoDTO {
    idFacturacion: string;
    importe: string;
    nombre: string;
    tipo: string;
    datosPagoAsuntoDTOList: DatosPagoAsuntoDTO[] = [];
}