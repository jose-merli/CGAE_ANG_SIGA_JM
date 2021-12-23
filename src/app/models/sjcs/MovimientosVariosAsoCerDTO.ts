import { Error } from "../Error";
import { MovimientosVariosAsoCerItem } from "./MovimientosVariosAsoCerItem";

export class MovimientosVariosAsoCerDTO {
    movimientosVariosAsoCerItemList: MovimientosVariosAsoCerItem[] = [];
    error: Error;
}