import { EjgDocumentacionItem } from "./EjgDocumentacionItem";
import { ErrorItem } from "../ErrorItem";

export class EjgDocumetacionObject {
    error: ErrorItem;
    ejgItems: EjgDocumentacionItem[] = [];
    constructor() { }
}