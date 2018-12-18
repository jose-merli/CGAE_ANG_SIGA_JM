import { ConsultasItem } from "./ConsultasItem";
import { ErrorItem } from "./ErrorItem";

export class ConsultasObject {
    error: ErrorItem;
    consultaItem: ConsultasItem[] = [];
    constructor() { }
}