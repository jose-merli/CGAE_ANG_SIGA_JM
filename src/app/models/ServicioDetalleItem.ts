export class ServicioDetalleItem {
    idtiposervicios: number; //Valor Categoria
    idservicio: number; //Valor Tipo
    idserviciosinstitucion: number; //Valor Producto
    descripcion: string;//Descripcion producto
    iniciofinalponderado: string;
    momentocargo: string;
    permitirbaja: string = "0";
    permitiralta: string = "0";
    automatico: string; //Tipo Suscripcion
    cuentacontable: string;
    fechabaja: Date;
    idconsulta: number;
    criterios: string;
    facturacionponderada: string;
    idtipoiva: number;
    codigo_traspasonav: string;

    categoria: string; //Descripcion categoria
    valoriva: number;
    tipo: string; //Descripcion tipo

    formasdepagointernet: number[] = [];
    formasdepagosecretaria: number[] = [];
    formasdepagointernetoriginales: number[] = [];
    formasdepagosecretariaoriginales: number[] = [];
    editar: boolean = false;
    serviciooriginal: ServicioDetalleItem;


    codigoext;//codigoext (hay que crear la columna en la tabla)
    nofacturable//hay que crear la columna en la tabla?;


    constructor() { }
}