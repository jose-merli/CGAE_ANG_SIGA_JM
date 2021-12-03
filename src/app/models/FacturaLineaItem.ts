export class FacturaLineaItem {

    idFactura: string;
	numeroLinea: string;
	descripcion: string;
	precioUnitario: string;
	cantidad: string;
	importeNeto: string;
	tipoIVA: string;
	idTipoIVA: string;
	importeIVA: string;
	importeTotal: string;
	importeAnticipado: string;

	modoEdicion: boolean;

    constructor() {}
}