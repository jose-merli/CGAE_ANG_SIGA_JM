import { ComboItem } from "./ComboItem";

export class SerieFacturacionItem {

	idSerieFacturacion: string;
	observaciones: string;
	fechaBaja: Date;
	abreviatura: string;
	descripcion: string;
	tiposIncluidos: string[];

	idCuentaBancaria: string;
	cuentaBancaria: string;
	idSufijo: string;
	sufijo: string;

	idFormaPago: string;
	formaPago: boolean;

	generarPDF: boolean;
	idModeloFactura: string;
	idModeloRectificativa: string;

	envioFacturas: boolean;
	idPlantillaMail: string;

	traspasoFacturas: boolean;
	traspasoPlantilla:string;
	traspasoCodAuditoriaDef: string;

	confDeudor: string;
	ctaClientes: string;
	confIngresos: string;
	ctaIngresos: string;

	idTiposProductos: string[];
	tiposProductos: any[];
	idTiposServicios: string[];
	tiposServicios: any[];
	idEtiquetas: string;
	etiquetas: ComboItem[];
	idConsultasDestinatarios: string[];
	consultasDestinatarios: ComboItem[];

	idContadorFacturas: string;
	idContadorFacturasRectificativas: string;

	idSerieFacturacionPrevia: string;
	serieGenerica: boolean = false;
    
	constructor() { };

}