import { Error } from "../Error";
import { RetencionesItem } from "./RetencionesItem";

export class RetencionesObject {
    retencionesItemList: RetencionesItem[] = [];
    error: Error;
}