export class ContrarioEjgItem {

    idinstitucion: number;
    idtipoejg: number;
    anio: number;
    numero: number;
    idpersona: number;

    observaciones: string;

    idinstitucionProcu: number;
    idprocurador: number;

    idrepresentanteejg: number;
    nombrerepresentanteejg: string;

    idabogadocontrarioejg: number;
    nombreabogadocontrarioejg: string;

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

    fechabaja: Date;

    constructor() { }
}