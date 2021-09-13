export class ServicioDetalleItem {
    idtiposervicios: number; //Valor Categoria
    idservicio: number; //Valor Tipo
    idserviciosinstitucion: number; //Valor Producto
    descripcion: string;//Descripcion producto
    iniciofinalponderado: string;
    momentocargo: string;
    solicitarbaja: string = "0";
    solicitaralta: string = "0";
    cuentacontable: string;
    idimpresora: number;
    idplantilla: number;
    tipocertificado: string;
    fechabaja: Date;
    idcontador: string;
    nofacturable: string = "0";
    idtipoiva: number;
    codigoext: string;
    codigo_traspasonav: string;
    orden: number;

    categoria: string; //Descripcion categoria
    valoriva: number;
    tipo: string; //Descripcion tipo

    formasdepagointernet: number[] = [];
    formasdepagosecretaria: number[] = [];
    formasdepagointernetoriginales: number[] = [];
    formasdepagosecretariaoriginales: number[] = [];
    editar: boolean;
    serviciooriginal: ServicioDetalleItem;

    constructor() { }
}