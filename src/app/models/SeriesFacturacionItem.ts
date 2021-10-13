export class SeriesFacturacionItem {
    abreviatura: string;
    descripcion: string;

    cuentaBancaria: string;
    sufijo: string;
    tiposProductos: string[];
    tiposServicios: string[];
    etiquetas: string[];
    consultasDestinatarios: string[];
    contadorFacturas: string;
    contadorFacturasRectificativas: string;
  
    constructor() { };
  }