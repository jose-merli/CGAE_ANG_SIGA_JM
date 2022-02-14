export class FacturaEstadosPagosItem {
    
    fechaModificaion: Date;
	fechaMin: Date;

	idAccion: string;
	accion: string;

	modo: string;
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
	comisionIdFactura: string;
	comisionFactura: string;

	// Estados de abono SJCS
	fecha: Date;
	identificador: string;
	idPagosjg: string;
	idCuenta: string;
	cuentaBancaria: string;
	movimiento: string;
	importePendiente: string;
	idDisqueteAbono: string;

	nuevo: boolean;

    constructor() {}
}