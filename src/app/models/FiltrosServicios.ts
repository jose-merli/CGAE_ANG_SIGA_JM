export class FiltrosServicios {
    categoria: string;
    tipo: string;
    servicio: string;
    codigo: string; //El campo es llamado 'CODIGO_TRASPASONAV' en BD
    precioDesde: string;
    precioHasta: string;
    iva: string;
    formaPago: string;
    tipoSuscripcion: string; //El campo es llamado 'AUTOMATICO' en BD

    constructor() { }
}