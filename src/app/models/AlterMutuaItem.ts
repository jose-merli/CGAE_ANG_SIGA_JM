import { AseguradoItem } from "./AseguradoItem";
import { FamiliarItem } from "./FamiliarItem";

export class AlterMutuaItem {

    idPaquete: number;
    observaciones: String;
    asegurado: AseguradoItem;
    familiares: Array<FamiliarItem>;
    herederos: Array<FamiliarItem>;

    constructor() { }
}