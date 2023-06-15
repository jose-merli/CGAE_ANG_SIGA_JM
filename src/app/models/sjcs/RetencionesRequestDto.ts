export class RetencionesRequestDto {
    ncolegiado: string;
    tiposRetencion: string | string[];
    idDestinatarios: string | string[];
    fechainicio: Date;
    fechaFin: Date;
    idPagos: string | string[];
    fechaAplicacionDesde: Date;
    fechaAplicacionHasta: Date;
    historico: boolean;
    idRetenciones: string | string[];
    numeroAbono: string;
    idPersona: string;
    nombreApellidoColegiado: string;
    modoBusqueda: string;
}