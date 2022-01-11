import { ConceptoPagoItem } from "./ConceptoPagoItem";
import { Error } from "../Error";

export class ConceptoPagoObject {
    listaConceptos: ConceptoPagoItem[] = [];
    error: Error;
}