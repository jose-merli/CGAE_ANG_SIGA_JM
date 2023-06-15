import { MovimientosVariosFacturacionItem } from "../../features/sjcs/facturacionSJCS/movimientos-varios/MovimientosVariosFacturacionItem";
import { Error } from '../Error';

export class MovimientosVariosFacturacionDTO {
    facturacionItem: MovimientosVariosFacturacionItem;
    error: Error;
}