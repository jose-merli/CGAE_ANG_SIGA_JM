export class BusquedaFisicaItem {
  colegio: String;
  idPersona: String;
  idInstitucion: String[];
  nif: string;
  nombre: String;
  apellidos: String;
  primerApellido: String;
  segundoApellido: String;
  numeroColegiado: String;
  residente: String;
  situacion: String;
  fechaNacimiento: Date;
  tipoIdentificacion: String;
  numeroInstitucion: String;
  idProvincia: String;
  idActividadProfesional: String;
  domicilio: String;
  fechaEstado: String;
  onlyNif: Boolean;
  colegios_seleccionados: any[] = [];
  addDestinatarioIndv: boolean;
  constructor() { }
}
