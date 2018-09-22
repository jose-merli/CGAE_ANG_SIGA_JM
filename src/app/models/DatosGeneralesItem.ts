import { ComboEtiquetasItem } from "./ComboEtiquetasItem";

export class DatosGeneralesItem {
  idInstitucion: String;
  idPersona: String;
  idLenguaje: String;
  nif: String;
  denominacion: String;
  abreviatura: String;
  fechaConstitucion: Date;
  fechaAlta: Date;
  tipo: String;
  numeroIntegrantes: String;
  nombresIntegrantes: String;
  fechaBaja: Date;
  fechaInicio: Date;
  anotaciones: String;
  IDGrupos: String;
  sociedadProfesional: String;
  idioma: String;
  cuentaContable: String;
  grupos: String[];
  etiquetas: ComboEtiquetasItem[];
  idLenguajeSociedad: String;
  motivo: String;
  error: Error;
  prefijoNumsspp: String;
  sufijoNumsspp: String;
  contadorNumsspp: String;
  constructor() {}
}
