export class FacturaEstadosPagosItem {
    
    fechaModificaion: Date;
	fechaMin: Date;

	idAccion: string;
	accion: string;

	idEstado: string;
	estado: string;

	cuentaBanco: string;
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

	notaMaxLength: number;
	comentario: string;

	comision: boolean;

    constructor() {}
}