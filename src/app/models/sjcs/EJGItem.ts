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

    idInstitucion: string;

    dictamenSing: string;
    fundamentoCalifDes: string;

    fechaDictamenDesd: Date;
    fechaDictamenHast: Date;


    fechaResolucionDesd: Date;
    fechaResolucionHast: Date;
    impugnacion: string;
    fundamentoImpuganacion: string;
    fechaImpugnacionDesd: Date;
    fechaImpugnacionHast: Date;

    //Defensa juridica (Ficha pre-designacion)
    juzgado: string;
    asunto: string;
    calidad: string;
    perceptivo: string;
    renuncia: string;
    numAnnioProcedimiento: string;
    procedimiento: string;
    nig: string;
    idsituacion: number;
    numerodiligencia: string;
    comisaria: number;
    delitos: string;
    idPretension: number;
    observaciones: string;


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
    idPersonajg: string;

    turno: string;
    idTurno: string;
    guardia: string;
    idGuardia: string;
    numColegiado: string;
    apellidosYNombre: string;
    tipoLetrado: string;
    idPersona: string;
    prestacion: Array<string>;
    prestacionesRechazadas: Array<string>;
    turnoDes: string;
    anioexpInsos: string;
    numeroexpInsos: string;
    idTipoExpInsos: string;
    idInstTipoExp: string;
    fechapresentacion: Date;
    fechalimitepresentacion: Date;
    historico: boolean;
    observacionesDictamen: String;

    numDesigna: String;

    //Procurador (Ficha pre-designacion)

    fechaDesProc: Date;
    idProcurador: string;
    idInstitucionProc: number;
    numerodesignaproc: string;
    nombreApProcurador: string;

    //Dictamen

    iddictamen: number;
    fechaDictamen: Date;
    idTipoDictamen: number;
    fundamentoCalif: number;
    //el atributo dictamen hace referencia al texto de observaciones de la pestaña de dictamen
    dictamen: string;

    //REGTEL

    identificadords: string;

    //Resolucion

    annioActa: string;
    numActa: string;
    annioCAJG: string;
    numCAJG: string;

    ponente: string;
    resolucion: string;
    fundamentoJuridico: string;

    //Impugnacion
    requiereTurn: boolean;
    bis: boolean;
    fechaPublicacion: Date;
    nImpugnacion: String;
    observacionesImpugnacion: String;
    sentidoAuto: String;
    autoResolutorio: String;
    fechaAuto: Date;
    impugnacionDesc: String;

    fechaEstadoNew: Date;
    estadoNew: String;

    // Estados de solicitud de expediente económico
    estadosSolicitudExpEco: String[];

    // Check que indica si se busca EJGs por estados concretos o que hayan pasado por ese estado en algún momento
    ultimoEstado: boolean = true;

    informacionEconomica?: boolean;

    constructor() { }
}