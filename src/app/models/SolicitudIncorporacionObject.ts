import { SolicitudIncorporacionItem } from "./SolicitudIncorporacionItem";
import { ErrorItem } from "./ErrorItem";
export class SolicitudIncorporacionObject {
  error: Error;
  solicitudIncorporacionItem: SolicitudIncorporacionItem[] = [];
  constructor() { }
}
