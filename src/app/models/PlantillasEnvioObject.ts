import { PlantillaEnvioItem } from "./PlantillaEnvioItem";
import { ErrorItem } from "./ErrorItem";

export class PlantillasEnvioObject {
  error: ErrorItem;
  plantillasItem: PlantillaEnvioItem[] = [];
  constructor() { }
}
