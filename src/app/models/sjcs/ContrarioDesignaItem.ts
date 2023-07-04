export class ContrarioDesignaItem {

    idinstitucion: number;
    idturno: number;
    anio: number;
    numero: number;
    idpersona: number;

    observaciones: string;
    nombrerepresentante: string;

    idinstitucionProcu: number;
    idprocurador: number;

    idrepresentantelegal: number;

    idabogadocontrario: number;
    nombreabogadocontrario: string;

    tmpejisproccodcolegio: string;
    tmpejisprocdesccolegio: string;
    tmpejisprocnumcolegiado: string;
    tmpejisprocnombre: string;
    tmpejisprocapellido1: string;
    tmpejisprocapellido2: string;
    tmpejisprocnif: string;
    tmpejisletcodcolegio: string;
    tmpejisletdesccolegio: string;
    tmpejisletnumcolegiado: string;
    tmpejisletnombre: string;
    tmpejisletapellido1: string;
    tmpejisletapellido2: string;
    tmpejisletnif: string;

    idinstitucionorigen: number;

    fechabaja: Date;

    constructor() { }
}