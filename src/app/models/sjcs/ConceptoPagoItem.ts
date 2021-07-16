export class ConceptoPagoItem {
    idInstitucion: string;
    idPagosjg: string;
    idFacturacion: string;
    idConcepto: string;
    desConcepto: string;
    importeFacturado: Number;
    importePendiente: Number;
    porcentajePagado: Number;
    porcentajeApagar: Number | string;
    cantidadApagar: Number;
}