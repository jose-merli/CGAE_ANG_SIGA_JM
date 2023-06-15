export class InscripcionesDatosEntradaItem{
    idEstado: string;
    idturno: string;
    idguardia: string;
    afechade: Date;
    fechadesde: Date;
    fechahasta: Date;
    ncolegiado: string;
    apellidos: string;
    apellidos2: string;
    nombre:string;
    idpersona:string;

   
  constructor(obj: Object) {
    this.idEstado = obj['idEstado'];
    this.idturno = obj['idturno'];
    this.idguardia = obj['idGuardia'];
    this.afechade = obj['aFechaDe'];
    this.fechadesde = obj['fechaDesde'];
    this.fechahasta = obj['fechaHasta'];
    this.ncolegiado = obj['nColegiado'];
    this.apellidos = obj['apellidos'];
    this.apellidos2 = obj['apellidos2'];
    this.nombre = obj['nombre'];
    this.idpersona = obj['idPersona'];
  }
  }