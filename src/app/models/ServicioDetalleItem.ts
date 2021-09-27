export class ServicioDetalleItem {
    idtiposervicios: number; //Valor Categoria
    idservicio: number; //Valor Tipo
    idserviciosinstitucion: number; //Valor Producto
    descripcion: string; //Descripcion producto
    iniciofinalponderado: string = "P"; //Aplicación de precio por cambio de situación del interesado Radio Buttons
    facturacionponderada: string; //Facturación proporcional por días de suscripción Checkbox
    momentocargo: string;
    permitirbaja: string = "0";
    permitiralta: string = "0";
    automatico: string; //Tipo Suscripcion
    cuentacontable: string;
    fechabaja: Date;
    idconsulta: number;
    criterios: string;
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


    codigoext;
    nofacturable//hay que crear la columna en la tabla?;


    constructor() { }
}