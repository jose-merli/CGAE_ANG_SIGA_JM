import { ComboItem } from "./ComboItem";

export class FacturasItem {

    tipo: string;//"FACTURA" o "ABONO"

	idFactura: string;
	idAbono: string;
	idInstitucion: string;

	//datos generales
	numeroFactura: string;
	idEstado: string;
	estado: string;
	estadosFiltroFac: any[];
	estadosFiltroAb: any[];

	formaCobroFactura: string;
	formaCobroAbono: string;//Efectivo 'E', Banco 'B', Ambos 'A'

	contabilizado: string;
	numeroAbonoSJCS: string;//solo abono

	fechaEmision: Date;
	fechaEmisionDesde: Date;
	fechaEmisionHasta: Date;

	importeIVA: string;
	importeNeto: string;

	importefacturado: string;
	importefacturadoDesde: string;
	importefacturadoHasta: string;

	importeAdeudadoHasta: string;
	importeAdeudadoDesde: string;

	//importes factura
	importeAnticipado: string;
	importeCompensado: string;
	importeCaja: string;
	importeBanco: string;
	importePagado: string;
	importeAdeudadoPendiente: string;

	//importes abono
	importeAnuladoAb: string;
	importeCajaAb: string;
	importeBancoAb: string;
	importePagadoAb: string;
	importeAdeudadoPendienteAb: string;

	//facturacion
	idFacturacion: string;
	idSerieFacturacion: string;
	serie: string;
	facturacion: string;
	fechaEminionFacturacion: Date;
	identificadorAdeudos: string;
	identificadorTransferencia: string;
	identificadorDevolucion: string;

	//cliente
	idCliente: string;
	numeroColegiado: string;
	numeroIdentificacion: string;
	apellidos: string;
	nombre: string;

	//deudor
	idDeudor: string;
	identificacionDeudor: string;
	descripcionDeudor: string;
	abreviaturaDeudor: string;

	facturasPendientesDesde: string;
	facturasPendientesHasta: string;

	comunicacionesFacturas: string;
	comunicacionesFacturasHasta: string;
	comunicacionesFacturasDesde: string;

	ultimaComunicacion: Date;
	nombreInstitucion: string;

	//observaciones factura
	observacionesFactura: string;
	observacionesFicheroFactura: string;

	//observaciones abono
	observacionesAbono: string;
	motivosAbono: string;

	bancosCodigo: string;

	estadosFiltros: string[];
	cuentasBanco: ComboItem[];

	constructor() { };

}