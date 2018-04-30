import { PerfilItem } from "./PerfilItem";
import { ErrorItem } from "./ErrorItem";
export class PerfilesResponseDto {
  error: ErrorItem;
  usuarioGrupoItems: PerfilItem[] = [];
  constructor() { }
}
