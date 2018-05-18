import { CatalogoMaestroItem } from "./CatalogoMaestroItem";
import { ErrorItem } from "./ErrorItem";
export class CatalogoResponseDto {
  error: ErrorItem;
  catalogoMaestroItem: CatalogoMaestroItem[] = [];
  constructor() { }
}
