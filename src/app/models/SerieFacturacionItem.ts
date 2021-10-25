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
	formaPago: string;
	generarPDF: boolean;
	envioFacturas: boolean;
	traspasoFacturas: boolean;

	idTiposProductos: string[];
	tiposProductos: ComboItem[];
	idTiposServicios: string[];
	tiposServicios: ComboItem[];
	idEtiquetas: string;
	etiquetas: ComboItem[];
	idConsultasDestinatarios: string[];
	consultasDestinatarios: ComboItem[];

	idContadorFacturas: string;
	idContadorFacturasRectificativas: string;

	idSerieFacturacionPrevia: string;
	serieGenerica: boolean;
    
	constructor() { };

}