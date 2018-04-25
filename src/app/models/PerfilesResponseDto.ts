import { PerfilItem } from "./PerfilItem";
export class PerfilesResponseDto {
  error: String;
  usuarioGrupoItems: PerfilItem[] = [];
  constructor() {}
}
