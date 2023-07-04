import { DatosCursosItem } from "./DatosCursosItem";
import { CargaMasivaInscripcionItem } from "./CargaMasivaInscripcionItem";
export class CargaMasivaInscripcionObject {
  file: File;
  error: Error;
  cargaMasivaInscripcionesItem: CargaMasivaInscripcionItem[] = [];
  cursoItem: DatosCursosItem;
  constructor() { }
}
