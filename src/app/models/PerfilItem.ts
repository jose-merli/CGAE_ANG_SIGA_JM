import { ComboItem } from "./ComboItem";
export class PerfilItem {
  idGrupo: String;
  descripcionGrupo: String;
  descripcionRol: String;
  nombre: String;
  rolesAsignados: ComboItem[];
  rolesNoAsignados: ComboItem[];
  constructor() {}
}
