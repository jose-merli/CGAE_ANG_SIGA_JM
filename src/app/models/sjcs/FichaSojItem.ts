import { JusticiableItem } from "./JusticiableItem";

export class FichaSojItem {

    idInstitucion: string;
    idTipoSoj: string;
    anio: string;
    numero: string;
    descripcionTipoSoj: string;
    descripcionTipoSojColegio: string;

    sufijo: string;
    numSoj: string;

    fechaApertura: Date;
    estado: string;
    idPersona: string;
    idPersonaJG: string;

    idTurno: string;
    idGuardia: string;

    idTipoConsulta: string;
    idTipoRespuesta: string;
    descripcionConsulta: string;
    respuestaLetrado: string;

    ejgIdTipoEjg: string;
    ejgAnio: string;
    ejgNumero: string;

    facturado: string;
    pagado: string;

    idTipoSojColegio: string;
    actualizaDatos: string;
    justiciable: JusticiableItem;
    ncolegiado: string;
    nombreAp: string;

    constructor() { }
}