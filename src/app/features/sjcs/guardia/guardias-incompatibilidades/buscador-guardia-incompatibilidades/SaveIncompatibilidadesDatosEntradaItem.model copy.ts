export class SaveIncompatibilidadesDatosEntradaItem{
	  idTurno: string;
    idGuardia: string;
    idTurnoIncompatible: string;
    idGuardiaIncompatible: string;
    idInstitucion: string;
    motivos: string;
    diasSeparacionGuardias: string;
    usuario: string;

  constructor(obj: Object) {
    this.idTurno = obj['idTurno'];
    this.idGuardia = obj['idGuardia'];
    this.idTurnoIncompatible = obj['idTurnoIncompatible'];
    this.idGuardiaIncompatible = obj['idGuardiaIncompatible'];
    this.idInstitucion = obj['idInstitucion'];
    this.motivos = obj['motivos'];
    this.diasSeparacionGuardias = obj['diasSeparacionGuardias'];
    this.usuario = obj['usuario'];
  }
}
