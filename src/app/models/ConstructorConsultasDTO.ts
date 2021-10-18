import { ConstructorConsultasItem } from "./ConstructorConsultasItem";
import { ErrorItem } from "./ErrorItem";

export class ConstructorConsultasDTO {
    error: ErrorItem;
    constructorConsultasItem: ConstructorConsultasItem[] = [];
    constructor() { }
}