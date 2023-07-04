export class BusquedaRetencionesRequestDTO {

    idInstitucionList: string[] = [];
    idPartidaPresupuestariaList: string[] = [];
    idGrupoFacturacionList: string[] = [];
    idHitoGeneralList: string[] = [];
    nombre: string;
    idEstadoCertificacionList: string[] = [];
    fechaDesde: Date;
    fechaHasta: Date;
    idCertificacion: string;

    constructor() { }
}