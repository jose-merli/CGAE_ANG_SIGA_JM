export class FichaTarjetaPreciosItem {

    idpreciosservicios: number;
    idserviciosinstitucion: number;
    idtiposervicios: number;
    idservicio: number;
    precio: string;
    idperiodicidad: number;
    descripcionprecio: string;
    idcondicion: number;
    descripcionperiodicidad: string;
    descripcionconsulta: string;
    pordefecto: string;
    nuevo: string = '0';

    idperiodicidadoriginal: number;

    constructor() { }
}