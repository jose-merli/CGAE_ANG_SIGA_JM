export class ProductoDetalleItem {
    idproducto: number; //Tipo
    idtipoproducto: number; //Categoria
    idproductoinstitucion: number;
    idcontador: string;
    descripcion: string;
    cuentacontable: string;
    codigoext: string;
    valor: string;
    idtipoiva: number;
    momentocargo: string;
    fechabaja: Date;
    solicitarbaja: string = "0";
    solicitaralta: string = "0";
    tipocertificado: string;
    nofacturable: string;
    categoria: string;
    valoriva: number;
    tipo: string;

    constructor() { }
}