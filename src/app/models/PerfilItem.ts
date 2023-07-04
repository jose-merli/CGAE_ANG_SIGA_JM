import { ComboItem } from "./ComboItem";
export class PerfilItem {
  idGrupo: String;
  grupo: String[];
  descripcionGrupo: String;
  descripcionRol: String;
  asignarRolDefecto: ComboItem[];
  nombre: String;
  rolesAsignados: ComboItem[];
  rolesNoAsignados: ComboItem[];
  fechaBaja: Date;
  editar: boolean = false;
  new: boolean = false;
  constructor() {}
}
