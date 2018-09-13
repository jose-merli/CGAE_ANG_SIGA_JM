import { SolicitudIncorporacionItem } from "./SolicitudIncorporacionItem";
import { ErrorItem } from "./ErrorItem";
export class SolicitudIncorporacionObject {
  error: Error;
  solIncorporacionItems: SolicitudIncorporacionItem[] = [];
  constructor() { }
}
