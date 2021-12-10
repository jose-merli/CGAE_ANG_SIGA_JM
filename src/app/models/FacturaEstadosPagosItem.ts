export class FacturaEstadosPagosItem {
    
    fechaModificaion: Date;

	idAccion: string;
	accion: string;

	idEstado: string;
	estado: string;

	bancosCodigo: string;
	iban: string;

	impTotalPagado: string;
	impTotalPorPagar: string;

	IDSJCS: string;
	
	idCargos: string;
	idDevoluciones: string;

	idFactura: string;
	numeroFactura: string;
	
	idAbono: string;
	numeroAbono: string;

    constructor() {}
}