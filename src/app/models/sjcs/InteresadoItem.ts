export class InteresadoItem {

    idPersona: string;
    idInstitucion: string;
    idTurno: string;
    nif: string;
    nombre: string;
    asuntos: string;
    fechamodificacion: Date;
    fechanacimiento: Date;
    idpais: string;
    apellidos: string;
    apellido1: string;
    apellido2: string;
    direccion: string;
    codigopostal: string;
    idprofesion: string;
    regimenConyugal: string;
    idprovincia: string;
    idpoblacion: string;
    idestadocivil: string;
    tipopersonajg: string;
    idtipoidentificacion: string;
    observaciones: string;
    idrepresentantejg: string;
    idtipoencalidad: string;
    sexo: string;
    idlenguaje: string;
    fechaalta: Date;
    fax: string;
    correoelectronico: string;
    edad: string;
    idminusvalia: string;
    existedomicilio: string;
    idprovincia2: string;
    idpoblacion2: string;
    direccion2: string;
    codigopostal2: string;
    idtipodir: string;
    idtipodir2: string;
    cnae: string;
    idtipovia: string;
    escaleradir: string;
    pisodir: string;
    puertadir: string;
    idtipovia2: string;
    escaleradir2: string;
    idtipopersona: string;
    pisodir2: string;
    puertadir2: string;
    idpaisdir1: string;
    idpaisdir2: string;
    descpaisdir1: string;
    descpaisdir2: string;
    idtipoidentificacionotros: string;
    asistidosolicitajg: string;
    asistidoautorizaeejg: string;
    autorizaavisotelematico: string;
    anio: string;
    numero: string;
  
    numeroAsuntos: string;
    ultimoAsunto: string;
  
    parentesco: string;
    tipojusticiable: string;
    abogado;
    procurador;
  
    datosAsuntos: any[];
    validacionRepeticion: boolean;
    asociarRepresentante: boolean;
    constructor() { }
  }