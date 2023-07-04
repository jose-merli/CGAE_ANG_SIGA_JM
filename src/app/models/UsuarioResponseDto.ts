import { UsuarioItem } from "./UsuarioItem";
export class UsuarioResponseDto {
  error: Error;
  usuarioItem: UsuarioItem[] = [];
  constructor() { }
}
