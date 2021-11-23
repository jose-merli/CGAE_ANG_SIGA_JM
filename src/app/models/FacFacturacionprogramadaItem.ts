export class FacFacturacionprogramadaItem {

    // Datos generales
    idSerieFacturacion: string;
    compraSuscripcion: string;
    fechaInicioServicios: Date;
    fechaInicioProductos: Date;
    fechaFinServicios: Date;
    fechaFinProductos: Date;
    importe: string;

    fechaCompraSuscripcionDesde: Date;
    fechaCompraSuscripcionHasta: Date;
    importeDesde: string;
    importeHasta: string;
  
    // Estados
    idEstadoConfirmacion: string;
    estadoConfirmacion: string;
    idEstadoPDF: string;
    estadoPDF: string;
    idEstadoEnvio: string;
    estadoEnvio: string;
    idEstadoTraspaso: string;
    estadoTraspaso: string;
  
    // Fechas
    fechaPrevistaGeneracion: Date;
    fechaPrevistaGeneracionDesde: Date;
    fechaPrevistaGeneracionHasta: Date;

    fechaPrevistaConfirm: Date;
    fechaPrevistaConfirmDesde: Date;
    fechaPrevistaConfirmHasta: Date;

    fechaRealGeneracion: Date;
    fechaRealGeneracionDesde: Date;
    fechaRealGeneracionHasta: Date;

    fechaConfirmacion: Date;
    fechaConfirmacionDesde: Date;
    fechaConfirmacionHasta: Date;

    // Ficha
    idProgramacion: string;
    descripcion: string;
    nombreAbreviado: string;
    fechaProgramacion: Date;
    archivarFact: boolean;
    usuModificacion: string;
    fechaModificacion: Date;
    nombreFichero: string;
    logError: string;
    logTraspaso: string;
    traspasoFacturas: boolean;
    generaPDF: boolean;
    envio: boolean;
    idTipoPlantillaMail: string;
    traspasoPlatilla: string;
    traspasoCodAuditoriaDef: string;

    fechaPresentacion: Date;
    fechaRecibosPrimeros: Date;
    fechaRecibosRecurrentes: Date;
    fechaRecibosCOR1: Date;
    fechaRecibosB2B: Date;

    idModeloFactura: string;
    idModeloRectificativa: string;
    modeloFactura: string;
    modeloRectificativa: string;
  
    constructor() { }
  }