import { ListaProductosItems } from "./ListaProductosItems";

export class FichaCompraSuscripcionItem {

    //TARJETA CLIENTE
    idInstitucion: string;
    idPersona: string;
    nombre: string;
    apellidos: string;
    idtipoidentificacion: string;
    nif: string;

    //TARJETA SOLICITUD
    nSolicitud: string;
    usuModificacion: string;
    fechaSolicitud: Date;
    fechaAprobacion: Date;
    fechaDenegacion: Date;
    fechaAnulacion: Date;
    idFormaPago: number;

    
    //TARJETA FORMA DE PAGO
    idFormasPagoComunes: string;
    idFormaPagoSeleccionada: number;

    productos: ListaProductosItems[];
    
    constructor() {}
  }