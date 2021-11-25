import { ListaMovimientosMonederoItem } from "./ListaMovimientosMonederoItem";

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

    idLinea: string; //Identificador del monedero
    anioLinea : string;
    
    constructor() {}
  }