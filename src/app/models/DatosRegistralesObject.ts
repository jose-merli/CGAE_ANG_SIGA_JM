import { DatosRegistralesItem } from "./DatosRegistralesItem";
import { ErrorItem } from "./ErrorItem";
export class DatosRegistralesObject {
  error: Error;
  DatosRegistralesItem: DatosRegistralesItem[] = [];
  constructor() {}
}
