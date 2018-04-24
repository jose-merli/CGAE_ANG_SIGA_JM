import { CatalogoMaestroItem } from "./CatalogoMaestroItem";
export class CatalogoResponseDto {
  error: String;
  catalogoMaestroItem: CatalogoMaestroItem[] = [];
  constructor() {}
}
