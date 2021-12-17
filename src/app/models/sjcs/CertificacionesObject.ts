import { Error } from "../Error";
import { CertificacionesItem } from "./CertificacionesItem";

export class CertificacionesObject {

    certificacionesItemList: CertificacionesItem[] = [];
    error: Error;

    constructor() { }
}