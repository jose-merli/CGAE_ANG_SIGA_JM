import { Error } from "../Error";
import { MovimientosVariosApliCerItem } from "./MovimientosVariosApliCerItem";

export class MovimientosVariosApliCerDTO {
    movimientosVariosApliCerItemList: MovimientosVariosApliCerItem[] = [];
    error: Error;
}