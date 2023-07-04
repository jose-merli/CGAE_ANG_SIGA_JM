import { HistoricoActuacionAsistenciaItem } from "./HistoricoActuacionAsistenciaItem";

export class ActuacionAsistenciaItem {

    idActuacion: string;
    fechaActuacion: string;
    fechaJustificacion: string;
    lugar: string;
    numeroAsunto: string;
    comisariaJuzgado: string;
    tipoActuacion: string;
    tipoActuacionDesc: string;
    validada: string;
    anulada: string;
    facturada: string;
    idFacturacion: string;
    facturacionDesc: string;
    fechaDesde: string;
    idCoste: string;
    costeDesc: string;
    estado: string;
    ultimaModificacion: HistoricoActuacionAsistenciaItem;
    numDocumentos: string;

    constructor() { }

}