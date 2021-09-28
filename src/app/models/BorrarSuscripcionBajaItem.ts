export class BorrarSuscripcionItem {

    idtiposervicios: number; //Categoria servicio
    idservicio: number; //Tipo Servicio
    idserviciosinstitucion: number; //Servicio
    opcionaltasbajas: string = "altasBajas";
    fechaeliminacionaltas: Date;
    incluirbajasmanuales: string = "0";

    constructor() { }
}