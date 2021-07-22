export class ProductoDetalleItem {
    idproducto: number; //Valor Tipo
    idtipoproducto: number; //Valor Categoria
    idproductoinstitucion: number; //Valor Producto
    idcontador: string;
    descripcion: string;//Descripcion producto
    cuentacontable: string;
    codigoext: string;
    valor: string;
    idtipoiva: number;
    momentocargo: string;
    fechabaja: Date;
    solicitarbaja: string = "0";
    solicitaralta: string = "0";
    tipocertificado: string;
    nofacturable: string = "0";
    categoria: string; //Descripcion categoria
    valoriva: number;
    tipo: string; //Descripcion tipo

    formasdepagointernet: number[];
    formasdepagosecretaria: number[];

    constructor() { }
}