export class ListaServiciosItems {
    idinstitucion: number;
    idservicio: number;
    idtiposervicios: number;
    idserviciosinstitucion: number;
    descripcion: string;
    fechabaja: Date;
    automatico: String; //Tipo Suscripcion
    idtipoiva: number;
    categoria: string;
    tipo: string;
    iva: string;
    precioperiodicidad: string;
    formapago: string;
    noFacturable: string;

    constructor() { }
}