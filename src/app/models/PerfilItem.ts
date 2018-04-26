import { ComboItem } from "./ComboItem";
export class PerfilItem {
  idGrupo: String;
  descripcionGrupo: String;
  descripcionRol: String;
  asignarRolDefecto: ComboItem[];
  nombre: String;
  rolesAsignados: ComboItem[];
  rolesNoAsignados: ComboItem[];
  constructor() {}
}
