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
  sexo: String;
  nombrePoblacion: String; 
  direccion: String;
  idPoblacion: String;
  idPais: String;

  codigoPostal: String;
  telefono1: String;
  telefono2: String;
  fax1: String;
  fax2: String;
  movil: String;
  correoelectronico: String;
  fromDesignaciones: boolean;

  constructor() { }
}
