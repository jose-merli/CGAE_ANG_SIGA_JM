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
    
    resolucion: string;
    fundamentoJuridico: string;
    fechaResolucionDesd: Date;
    fechaResolucionHast: Date;
    impugnacion: string;
    fundamentoImpuganacion: string;
    fechaImpugnacionDesd: Date;
    fechaImpugnacionHast: Date;

    //Defensa juridica
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

    //Procurador
    
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

    

    constructor() { }
}