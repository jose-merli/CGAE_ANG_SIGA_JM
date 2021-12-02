export class FacturasItem {

    idFactura: string;
    numeroFactura: string;
    estado: string;
    estados: any[];
    formaCobroFactura: string;
    formaCobroAbono: string;
    numeroAbonoSJCS: string;
    fechaEmision: Date;
    fechaEmisionDesde: Date;
    fechaEmisionHasta: Date;
    importefacturado: string;
    importefacturadoDesde: string;
    importefacturadoHasta: string;
    contabilizado: string;

    serie: string;
    facturacion: string;
    identificadorAdeudos: string;
    identificadorTransferencia: string;
    identificadorDevolucion: string;

    //colegio: string;
    numeroColegiado: string;
    numeroIdentificacion: string;
    apellidos: string;
    //apellidos2: string;
    nombre: string;

    facturasPendientesDesde: string;
    facturasPendientesHasta: string;
    importeAdeudadoPendiente: string;
    importeAdeudadoHasta: string;
    importeAdeudadoDesde: string;
    comunicacionesFacturas: string;
    comunicacionesFacturasHasta: string;
    comunicacionesFacturasDesde: string;

    tipo: string;
    ultimaComunicacion: Date;
    nombreInstitucion: string;

	importePagado: string;

	//Actualizar observaciones factura
	observacionesFactura: string;
	observacionesFicheroFactura: string;

	//Actualizar observaciones abono
	observacionesAbono: string;
	motivosAbono: string;

	constructor() { };

}