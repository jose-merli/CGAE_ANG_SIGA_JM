import { ListaMovimientosMonederoItem } from "./ListaMovimientosMonederoItem";
import { ListaServiciosMonederoItem } from "./ListaServiciosMonederoItem";

export class FichaMonederoItem {

    //TARJETA DATOS GENERALES
    idInstitucion: string;
    idPersona: string;
    nombre: string;
    apellidos: string;
    idtipoidentificacion: string;
    nif: string;

    //TARJETA MOVIMIENTOS
    movimientos: ListaMovimientosMonederoItem[];

    //TARJETA SERVICIOS
    servicios: ListaServiciosMonederoItem[]; 

    idLinea: string; //Identificador del monedero
    anioLinea : string;
    
    constructor() {}
  }