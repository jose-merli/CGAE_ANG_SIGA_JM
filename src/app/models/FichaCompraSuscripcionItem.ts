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
    nSolicitud: string; //Equivaldria al idpeticion de la tabla PYS_PETICIONCOMPRASUSCRIPCION
    usuModificacion: string;
    fechaPendiente: Date;
    fechaDenegada: Date;
    fechaAceptada: Date;
    fechaSolicitadaAnulacion: Date;
    fechaAnulada: Date;

    
    //TARJETA FORMA DE PAGO
    idFormasPagoComunes: string;
    idFormaPagoSeleccionada: number;
    totalNeto: number;
    totalIVA: number;
    impTotal: number;
    pendPago: number;
    cuentaBancSelecc: string;
    noFact: string;

    idEstadoPeticion: string;
    productos: ListaProductosItems[];
    
    constructor() {}
  }