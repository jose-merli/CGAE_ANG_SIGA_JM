export class DeleteIncompatibilidadesDatosEntradaItem{
	  idTurno: string;
    idGuardia: string;
    idTurnoIncompatible: string;
    idGuardiaIncompatible: string;
    idInstitucion: string;


  constructor(obj: Object) {
    this.idTurno = obj['idTurno'];
    this.idGuardia = obj['idGuardia'];
    this.idTurnoIncompatible = obj['idTurnoIncompatible'];
    this.idGuardiaIncompatible = obj['idGuardiaIncompatible'];
    this.idInstitucion = obj['idInstitucion'];

  }
}
