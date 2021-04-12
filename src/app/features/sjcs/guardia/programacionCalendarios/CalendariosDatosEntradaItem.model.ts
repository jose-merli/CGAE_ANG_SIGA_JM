export class CalendariosDatosEntradaItem{
  tipo: string;
  turno: string;
  nombre: string;
  lugar: string;
  observaciones: string;


  constructor(obj: Object) {
    this.tipo = obj['tipo'];
    this.turno = obj['turno'];
    this.nombre = obj['nombre'];
    this.lugar= obj['lugar'];
    this.observaciones = obj['observaciones'];
  }
}
