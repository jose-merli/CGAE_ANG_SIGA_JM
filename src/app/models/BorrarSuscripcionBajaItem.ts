export class BorrarSuscripcionItem {

    idtiposervicios: number; //Categoria servicio
    idservicio: number; //Tipo Servicio
    idserviciosinstitucion: number; //Servicio
    opcionaltasbajas: string = "0";
    checkboxDialogServicioAutomaticoAManual: boolean;
    fechaeliminacionaltas: Date = new Date();
    incluirbajasmanuales: string = "0";

    constructor() { }
}