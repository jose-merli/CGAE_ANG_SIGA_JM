export class ConceptoPagoItem {
    idInstitucion: string;
    idPagosjg: string;
    idFacturacion: string;
    idConcepto: string;
    desConcepto: string;
    idGrupoFacturacion: string;
    importeFacturado: number;
    importePendiente: number;
    porcentajePendiente: number;
    porcentajeApagar: number | string;
    cantidadApagar: number;
    nuevo: boolean;
    cantidadRestante: number;
    porcentajeRestante: number | string;
}