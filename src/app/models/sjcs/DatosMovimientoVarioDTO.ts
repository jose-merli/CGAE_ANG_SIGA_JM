import { DatosPagoAsuntoDTO } from "./DatosPagoAsuntoDTO";

export class DatosMovimientoVarioDTO {
    descripcion: string;
    idMovimiento: string;
    importe: string;
    tipo: string;
    datosPagoAsuntoDTOList: DatosPagoAsuntoDTO[] = [];
}