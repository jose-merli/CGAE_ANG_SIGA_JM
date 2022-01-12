import { Error } from "../Error";
import { EstadoCertificacionItem } from "./EstadoCertificacionItem";

export class EstadoCertificacionDTO {

    estadoCertificacionItemList: EstadoCertificacionItem[] = [];
    error: Error;
}