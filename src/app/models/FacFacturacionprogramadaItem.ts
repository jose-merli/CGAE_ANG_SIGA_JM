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
    idEstadoPDF: string;
    idEstadoEnvio: string;
    idEstadoTraspaso: string;
  
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
    archivarFact: string;
    usuModificacion: string;
    nombreFichero: string;
    logError: string;
    logTraspaso: string;
    traspasoFacturas: string;
    traspasoPlatilla: string;
    traspasoCodAuditoriaDef: string;

  
    constructor() { }
  }