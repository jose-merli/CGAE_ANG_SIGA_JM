import { UsuarioItem } from "./UsuarioItem";
export class UsuarioResponseDto {
  error: String;
  usuarioItem: UsuarioItem[] = [];
  constructor() {}
}
