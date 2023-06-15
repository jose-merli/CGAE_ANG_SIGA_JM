export class FacturaLineaItem {

    idFactura: string;
	numeroLinea: string;
	descripcion: string;
	precioUnitario: number;
	cantidad: string;
	importeNeto: number;
	tipoIVA: string;
	idTipoIVA: string;
	importeIVA: number;
	importeTotal: number;
	importeAnticipado: number;

	modoEdicion: boolean;

    constructor() {}
}