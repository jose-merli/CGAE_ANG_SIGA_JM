import { ErrorItem } from "../ErrorItem";
import { EstadoEJGItem } from "./EstadoEJGItem";

export class EstadoEJGObject {
    error: ErrorItem;
    estadoEjgItems: EstadoEJGItem[] = [];
    constructor() { }
}