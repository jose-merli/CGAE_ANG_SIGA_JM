import { PlantillaEnvioConsultasItem } from "./PlantillaEnvioConsultasItem";
import { ErrorItem } from "./ErrorItem";

export class PlantillasEnvioConsultasObject {
  error: ErrorItem;
  consultaItem: PlantillaEnvioConsultasItem[] = [];
  constructor() { }
}
