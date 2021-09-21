import { ErrorItem } from "../ErrorItem";
import { ResolucionEJGItem } from "./ResolucionEJGItem";

export class ResolucionEJGObject {
    error: ErrorItem;
    procuradorItems: ResolucionEJGItem[] = [];
    constructor() { }
}