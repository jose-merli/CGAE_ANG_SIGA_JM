import { FacFacturacionprogramadaItem } from "../FacFacturacionprogramadaItem";
import { FacturasItem } from "../FacturasItem";

export class FicherosAdeudosItem {

    idInstitucion: String;
	idDisqueteCargos: String;
	nombreFichero: String;
	bancosCodigo: String;
	cuentaEntidad: String;
	iban: String;
	fechaCreacion: Date;
	fechaCreacionDesde: Date;
	fechaCreacionHasta: Date;
	idseriefacturacion: String;
	nombreabreviado: String;
	idprogramacion: String;
	descripcion: String;
	fechacargo: Date;
	numerolineas: String;
	idSufijo: String;
	sufijo: String;
	totalRemesa: string;
	importeTotalDesde: String;
	importeTotalHasta: String;
	numRecibos: String;
	numRecibosDesde: String;
	numRecibosHasta: String;
	origen: String;
	facturacion: String;
	fechaPresentacion: Date;
	fechaRecibosPrimeros: Date;
	fechaRecibosRecurrentes: Date;
	fechaRecibosCOR: Date;
	fechaRecibosB2B: Date;
	fechaUltimaModificacion: Date;
	
	facturasGeneracion: string[];
	facturacionesGeneracion: FacFacturacionprogramadaItem[];

    constructor() { }
}