export class ResultadoIncompatibilidades{
  existe: string;
  idTurno: string;
  nombreTurno: string;
  nombreGuardia: string;
  idGuardia: string;
  nombreTurnoIncompatible: string;
  idTurnoIncompatible: string;
  nombreGuardiaIncompatible: string;
  idGuardiaIncompatible: string;
  motivos: string;
  diasSeparacionGuardias: string;

  constructor(obj: Object) {
    this.existe = obj['existe'];
    this.idTurno = obj['idTurno'];
    this.nombreTurno = obj['nombreTurno'];
    this.nombreGuardia = obj['nombreGuardia'];
    this.idGuardia = obj['idGuardia'];
    this.nombreTurnoIncompatible = obj['nombreTurnoIncompatible'];
    this.idTurnoIncompatible = obj['idTurnoIncompatible'];
    this.nombreGuardiaIncompatible = obj['nombreGuardiaIncompatible'];
    this.idGuardiaIncompatible = obj['idGuardiaIncompatible'];
    this.motivos = obj['motivos'];
    this.diasSeparacionGuardias = obj['diasSeparacionGuardias'];
  }
}
