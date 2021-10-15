export class SerieFacturacionItem {
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
  

    tiposIncluidos: string[];
    formaPago: string;
    generarPDF: string;
    envioFactura: string;
    traspasoFacturas: string;
    
    constructor() { };
  }