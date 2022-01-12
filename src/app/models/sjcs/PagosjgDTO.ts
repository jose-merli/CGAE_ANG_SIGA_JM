import { PagosjgItem } from "./PagosjgItem";
import { Error } from "../Error";

export class PagosjgDTO {
  error: Error;
  pagosjgItem: PagosjgItem[] = [];

  constructor() { }
}