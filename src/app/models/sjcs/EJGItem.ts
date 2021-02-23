export class EJGItem {

    idEJG: string;
    colegio: string;
    annio: string;
    numero: string;
    numEjg: string;
    tipoEJG: string;
    tipoEJGColegio: string;
    creadoDesde: string;
    fechaAperturaDesd: Date;
    fechaAperturaHast: Date;
    fechaApertura: Date;
    estadoEJG: string;
    fechaEstadoDesd: Date;
    fechaEstadoHast: Date;
    fechaLimiteDesd: Date;
    fechaLimiteHast: Date;


    dictamen: string;
    dictamenSing: string;
    fundamentoCalif: string;
    fundamentoCalifDes: string;

    fechaDictamenDesd: Date;
    fechaDictamenHast: Date;
    fechaDictamen: Date;
    resolucion: string;
    fundamentoJuridico: string;
    fechaResolucionDesd: Date;
    fechaResolucionHast: Date;
    impugnacion: string;
    fundamentoImpuganacion: string;
    fechaImpugnacionDesd: Date;
    fechaImpugnacionHast: Date;

    juzgado: string;
    asunto: string;
    calidad: string;
    perceptivo: string;
    renuncia: string;
    numAnnioProcedimiento: string;
    procedimiento: string;
    nig: string;

    annioCAJG: string;
    numCAJG: string;
    annioActa: string;
    numActa: string;
    ponente: string;
    fechaPonenteDesd: Date;
    fechaPonenteHast: Date;
    numRegRemesa: string;
    numRegRemesa1: string;
    numRegRemesa2: string;
    numRegRemesa3: string;

    nif: string;
    apellidos: string;
    nombre: string;
    nombreApeSolicitante: string;
    rol: string;

    turno: string;
    idTurno: string;
    guardia: string;
    idGuardia: string;
    numColegiado: string;
    apellidosYNombre: string;
    tipoLetrado: string;
    idPersona: string;
    prestacion: string;
    turnoDes: string;
    anioexpediente: string;
    numeroexpediente: string;
    idTipoExpediente: string;
    fechapresentacion: Date;
    fechalimitepresentacion: Date;
    historico: boolean;
    observacionesDictamen: String;
    iddictamen: String;

    requiereTurn: boolean;
    bis: boolean;
    fechaPublicacion: Date;
    nImpugnacion: String;
    observacionesImpugnacion: String;
    sentidoAuto: String;
    autoResolutorio: String;
    fechaAuto: Date;

    fechaEstadoNew: Date;
    estadoNew: String;

    nuevoEJG: boolean;

    etiquetas: any[];

    constructor() { }
}