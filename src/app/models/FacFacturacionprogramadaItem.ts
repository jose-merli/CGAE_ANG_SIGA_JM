export class FacFacturacionprogramadaItem {

    // Datos generales
    idSerieFacturacion: string;
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
  
    constructor() { }
  }