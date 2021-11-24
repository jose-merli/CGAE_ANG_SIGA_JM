export class MovimientosVariosFacturacionItem {

	descripcion: String;
	tipo: String;
	certificacion: String;
	idAplicadoEnPago: String;
	fechaApDesde: Date;
	fechaApHasta: Date;
	idFacturacionApInicial: String;
    idConcepto: String;
    idPartidaPresupuestaria: String;
    ncolegiado: String;
    letrado: String; //nombre, apellidos
    cantidad: number;
    cantidadAplicada: number;
    cantidadRestante:number;
	idInstitucion: String;
	idMovimiento: String;
	idPersona: String;
	motivo: String;
	fechaAlta: Date;
	fechaModificacion: Date;
	usuModificacion: number;
	contabilizado: String;
	idFacturacion: String;
	idGrupoFacturacion: String;
	historico: Boolean;
    nif: String;
	apellido1: String;
	apellido2: String;
	nombre: String;
	nombrefacturacion: String;
	nombretipo: String;
	nombrePago: String;
	
	constructor() { }
}