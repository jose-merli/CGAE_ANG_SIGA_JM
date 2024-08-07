export class CartasFacturacionPagosItem {
	idInstitucion: string;
	idTurno: string;
	idPago: string | string[];
	idFacturacion: string | string[];
	idConcepto: string;
	fechaDesde: Date;
	fechaHasta: Date;
	nombre: string;
	regularizacion: string;
	desEstado: string;
	idEstado: string;
	fechaEstado: Date;
	importeTotal: string;
	importePagado: string;
	idPartidaPresupuestaria: string;
	importePendiente: string;
	prevision: string;
	visible: string;
	apellidosNombre: string;
	ncolegiado: string;
	idPersona: string;

	modoBusqueda: string;

	constructor() { }
}