export class RetencionesRequestDto {
    ncolegiado: string;
    tiposRetencion: string | string[];
    idDestinatarios: string | string[];
    fechaInicio: Date;
    fechaFin: Date;
    idPagos: string | string[];
    fechaAplicacionDesde: Date;
    fechaAplicacionHasta: Date;
    historico: boolean;
}