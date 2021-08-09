export class UnidadFamiliarEJGItem {
    nombreApeSolicitante: string;
    expedienteEconom: string;
    uf_idTipoejg: string;
    uf_anio: string;
    uf_numero: string;
    uf_idPersona: string;
    uf_solicitante: string;
    uf_enCalidad: string;
    //Variable con la que se mostrara el valor de uf_enCalidad
    //1: "Unidad Familiar", 2: "Solicitante", 3: "Solicitante Principal"
    labelEnCalidad: string;
    pjg_nif: string;
    //pjg_nombre: string;
    //pjg_ape1: string;
    //pjg_ape2: string;
    pjg_nombrecompleto: string;
    pjg_direccion: string;
    representante: string;
    direccionRepresentante: string;
    nifRepresentante: string;
    // nombrePrincipal: string;
    // apellido1Principal: string;
    // apellido2Principal: string;
    pd_descripcion: string;
    estado: string;
    estadoDes: string;
    fechaSolicitud: Date
    fechaBaja: string;
    
    circunsExcep: number;
    incapacitado: number;
    
    idParentesco: number;
    idTipoGrupoLab: number;
    idTipoIngreso: number;
    
    descrIngrAnuales: string;
    bienesInmu: string;
    bienesMu: string;
    otrosBienes: string;
    
    impIngrAnuales: number;
    impBienesInmu: number;
    impBienesMu: number;
    impOtrosBienes: number;
    
    observaciones: string;

    isRepresentante: boolean;

    relacionadoCon: string;
    constructor() { }
}