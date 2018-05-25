import { PersonaItem } from "./PersonaItem";
import { ErrorItem } from "./ErrorItem";
export class PersonaObject {
  error: Error;
  PersonaItems: PersonaItem[] = [];
  constructor() {}
}
