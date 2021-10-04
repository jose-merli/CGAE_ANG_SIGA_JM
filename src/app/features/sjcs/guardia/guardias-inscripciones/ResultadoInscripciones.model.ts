export class ResultadoInscripciones {
  idturno: String;
  estado: String;
  abreviatura: String;
  validarinscripciones: String;
  validarjustificaciones: String;
  nombreGuardia: String;
  descripcionGuardia: String;
  idguardia: String;
  apellidosnombre: String;
  ncolegiado: String;
  nombre: String;
  apellidos: String;
  apellidos2: String;
  idinstitucion: number;
  idpersona: String;
  fechasolicitud: Date;
  observacionessolicitud: String;
  fechavalidacion: Date;
  observacionesvalidacion: String;
  fechasolicitudbaja: Date;
  observacionesbaja: String;
  fechabaja: Date;
  observacionesvalbaja: String;
  fechadenegacion: Date;
  observacionesdenegacion: String;
  fechavaloralta: Date;
  fechavalorbaja: Date;
  code: String;
  message: String;
  description: String;
  infoURL: String;
  errorDetail: String;
  

  constructor(obj: Object) {
    this.idturno = obj['idturno'];
    this.estado = obj['estado'];
    this.abreviatura = obj['abreviatura'];
    this.validarinscripciones = obj['validarinscripciones'];
    this.validarjustificaciones = obj['validarjustificaciones'];
    this.nombreGuardia = obj['nombreGuardia'];
    this.descripcionGuardia = obj['descripcionGuardia'];
    this.idguardia = obj['idguardia'];
    this.apellidosnombre = obj['apellidosnombre'];
    this.ncolegiado = obj['ncolegiado'];
    this.nombre = obj['nombre'];
    this.apellidos = obj['apellidos'];
    this.apellidos2 = obj['apellidos2'];
    this.idinstitucion = obj['idinstitucion'];
    this.idpersona = obj['idpersona'];
    this.fechasolicitud = obj['fechasolicitud'];
    this.observacionessolicitud = obj['observacionessolicitud'];
    this.fechavalidacion = obj['fechavalidacion'];
    this.observacionesvalidacion = obj['observacionesvalidacion'];
    this.fechasolicitudbaja = obj['fechasolicitudbaja'];
    this.observacionesbaja = obj['observacionesbaja'];
    this.fechabaja = obj['fechabaja'];
    this.observacionesvalbaja = obj['observacionesvalbaja'];
    this.fechadenegacion = obj['fechadenegacion'];
    this.observacionesdenegacion = obj['observacionesdenegacion'];
    this.fechavaloralta = obj['fechavaloralta'];
    this.fechavalorbaja = obj['fechavalorbaja'];
    this.code = obj['code'];
    this.message = obj['message'];
    this.description = obj['description'];
    this.infoURL = obj['infoURL'];
    this.errorDetail = obj['errorDetail'];
    
  }
}