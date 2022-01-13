export class SaveIncompatibilidadesDatosEntradaItem{
	  idTurno: string;
    idGuardia: string;
    idTurnoIncompatible: string;
    idGuardiaIncompatible: string;
    idInstitucion: string;
    motivos: string;
    diasSeparacionGuardias: string;
    usuario: string;
    nombreTurno: string;
    nombreGuardia: string;
    nombreTurnoIncompatible: string;
    nombreGuardiaIncompatible: string;
  constructor(obj: Object) {
    this.idTurno = obj['idTurno'];
    this.idGuardia = obj['idGuardia'];
    this.idTurnoIncompatible = obj['idTurnoIncompatible'];
    this.idGuardiaIncompatible = obj['idGuardiaIncompatible'];
    this.idInstitucion = obj['idInstitucion'];
    this.motivos = obj['motivos'];
    this.diasSeparacionGuardias = obj['diasSeparacionGuardias'];
    this.usuario = obj['usuario'];
    this.nombreTurno = obj['nombreTurno'];
    this.nombreGuardia = obj['nombreGuardia'];
    this.nombreTurnoIncompatible = obj['nombreTurnoIncompatible'];
    this.nombreGuardiaIncompatible = obj['nombreGuardiaIncompatible'];
  }
}
