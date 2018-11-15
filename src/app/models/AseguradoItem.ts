import { FamiliarItem } from "./FamiliarItem";

export class AseguradoItem {

    modContratacion: String;
    tarifa: number;
    identificador: String;
    tipoIdentificador: number;
    nombre: String;
    apellidos: String;
    fechaNacimiento: Date;
    sexo: String;
    estadoCivil: String;
    colegio: String;
    sitEjercicio: String;
    medioComunicacion: String;
    idioma: String;
    telefono: String;
    telefono2: String;
    movil: String;
    fax: String;
    mail: String;
    publicidad: boolean;
    domicilio: String;
    cp: String;
    pais: String;
    provincia: String;
    poblacion: String;
    tipoDireccion: String;
    iban: String;
    tipoEjercicio: String;
    familiares: FamiliarItem[];
    beneficiarios: FamiliarItem[];

    constructor() { }
}