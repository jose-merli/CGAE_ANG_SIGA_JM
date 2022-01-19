export class ComboPreciosSuscripcionItem {

    idpreciosservicios: number;
    idserviciosinstitucion: number;
    idtiposervicios: number;
    idservicio: number;
    precio: string;
    idperiodicidad: number;
    periodicidadValor: number;
    descripcionprecio: string;
    idcondicion: number;
    descripcionperiodicidad: string;
    descripcionconsulta: string;
    pordefecto: string;
    nuevo: string = '0';
    valido: string;

    idperiodicidadoriginal: number;

    constructor() { }
}