import { PerfilItem } from "./PerfilItem";
export class PerfilesRequestDto {
  error: String;
  usuarioGrupoItems: PerfilItem[] = [];
  constructor() {}
}
