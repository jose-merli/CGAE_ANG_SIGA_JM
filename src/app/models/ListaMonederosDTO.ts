import { ListaMonederosItem } from "./ListaMonederosItem";

export class ListaMonederosDTO {
    error: Error;
    monederoItems: ListaMonederosItem[] = [];

    constructor() { }
}