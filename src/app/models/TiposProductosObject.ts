import { TiposProductosItem } from "./TiposProductosItem";
import { Error } from "./Error";

export class TiposProductosObject {
    error: Error;
    tiposProductosItems: TiposProductosItem[] = [];

    constructor() { }
}