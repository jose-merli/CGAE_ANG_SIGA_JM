export class IncompatibilidadesDatosEntradaItem{
	  idTurno: string;
    nombreGuardia: string;
    idArea: string;
    idMateria: string;
    idZona: string;
    idSubZona: string;
    idJurisdiccion: string;
    idGrupoFacturacion: string;
    idPartidaPresupuestaria: string;
    idTipoTurno: string;
    idTipoGuardia: string;
    idGuardia: string;

  constructor(obj: Object) {
    this.idTurno = obj['idTurno'];
    this.idGuardia = obj['idGuardia'];
    this.nombreGuardia = obj['nombreGuardia'];
    this.idArea = obj['idArea'];
    this.idMateria = obj['idMateria'];
    this.idZona = obj['idZona'];
    this.idSubZona = obj['idSubZona'];
    this.idJurisdiccion = obj['idJurisdiccion'];
    this.idGrupoFacturacion = obj['idGrupoFacturacion'];
    this.idPartidaPresupuestaria = obj['idPartidaPresupuestaria'];
	  this.idTipoTurno = obj['idTipoTurno'];
    this.idTipoGuardia = obj['idTipoGuardia'];
  }
}
