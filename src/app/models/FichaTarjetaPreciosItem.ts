export class FichaTarjetaPreciosItem {

    idpreciosservicios: number;
    idserviciosinstitucion: number;
    idtiposervicios: number;
    idservicio: number;
    precio: String;
    idperiodicidad: number;
    descripcionprecio: String;
    idcondicion: number;
    descripcionperiodicidad: String;
    descripcionconsulta: String;
    pordefecto: String;
    nuevo: String = '0';

    idperiodicidadoriginal: number;

    constructor() { }
}