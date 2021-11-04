import { ListaFacturasPeticionItem } from "./ListaFacturasPeticionItem";
import { ListaProductosCompraItem } from "./ListaProductosCompraItem";
import { ListaProductosItems } from "./ListaProductosItems";
import { ListaServiciosSuscripcionItem } from "./ListaServiciosSuscripcionItem";

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

    
    //TARJETA PRODUCTOS
    idFormasPagoComunes: string;
    idFormaPagoSeleccionada: string;
    totalNeto: string;
    totalIVA: string;
    impTotal: string;
    pendPago: number;
    impPagado: number;
    cuentaBancSelecc: string;
    productos: ListaProductosCompraItem[];

    //TRARJETA FACTURACION
    facturas: ListaFacturasPeticionItem[];

    //TARJETA DESCUENTOS Y ANTICIPOS


    //TARJETA SERVICIOS
    servicios: ListaServiciosSuscripcionItem[]; 

    idEstadoPeticion: string;
    
    constructor() {}
  }