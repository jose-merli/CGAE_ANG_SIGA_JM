import { PersonaJuridicaItem } from "./PersonaJuridicaItem";
import { ErrorItem } from "./ErrorItem";
export class PersonaJuridicaObject {
  error: Error;
  busquedaJuridicaItems: PersonaJuridicaItem[] = [];
  constructor() { }
}
