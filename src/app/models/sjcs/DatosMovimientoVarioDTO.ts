import { DatosPagoAsuntoDTO } from "./DatosPagoAsuntoDTO";

export class DatosMovimientoVarioDTO {
    descripcion: string;
    idObjeto: string;
    importe: string;
    tipo: string;
    numAplicaciones: number;
    datosPagoAsuntoDTOList: DatosPagoAsuntoDTO[] = [];
}