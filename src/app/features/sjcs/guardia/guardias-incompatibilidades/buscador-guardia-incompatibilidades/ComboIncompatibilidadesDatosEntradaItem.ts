export class ComboIncompatibilidadesDatosEntradaItem{
	  idTurno: string;
    idTipoGuardia: string;
    idPartidaPresupuestaria: string;
    labels: Boolean;
    idInstitucion: string;

  constructor(obj: Object) {
    this.idTurno = obj['idTurno'];
    this.idTipoGuardia = obj['idTipoGuardia'];
    this.idPartidaPresupuestaria = obj['idPartidaPresupuestaria'];
    this.labels = obj['labels'];
    this.idInstitucion = obj['idInstitucion'];

  }
}
