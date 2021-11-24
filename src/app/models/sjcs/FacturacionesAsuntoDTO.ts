import { DatosFacturacionAsuntoDTO } from "./DatosFacturacionAsuntoDTO";
import { DatosMovimientoVarioDTO } from "./DatosMovimientoVarioDTO";
import { Error } from '../Error';

export class FacturacionesAsuntoDTO {
    datosFacturacionAsuntoDTOList: DatosFacturacionAsuntoDTO[] = [];
    datosMovimientoVarioDTO: DatosMovimientoVarioDTO;
    error: Error;
}