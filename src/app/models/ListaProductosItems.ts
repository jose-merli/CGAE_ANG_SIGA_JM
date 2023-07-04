export class ListaProductosItems {
    idproducto: number;
    idtipoproducto: number;
    idproductoinstitucion: number;
    idcontador: string;
    descripcion: string;
    valor: string;
    fechabaja: Date;
    tipo: string;
    categoria: string;
    iva: string;
    precioiva: string;
    formapago: string;
    noFacturable: string;
    idtipoiva: string;
    valorIva: string;
    fechaBajaIva: Date;
    idFormasPago: string; // Ids de las formas de pago disponibles. 
    formasPagoInternet: string;// Personal del colegio = pago por secretaria ("S"), colegiado = formas de pago por internet ("A").
    solicitarAlta: number; // Solicitar por internet

    constructor() { }
}