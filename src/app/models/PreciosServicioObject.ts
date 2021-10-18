import { Error } from "./Error";
import { FichaTarjetaPreciosItem } from "./FichaTarjetaPreciosItem";

export class PreciosServicioObject {
    error: Error;
    fichaTarjetaPreciosItem: FichaTarjetaPreciosItem[] = [];

    constructor() { }
}