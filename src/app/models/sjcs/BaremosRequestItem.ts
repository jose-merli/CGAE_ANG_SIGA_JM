import { GuardiaItem } from "../guardia/GuardiaItem";

export class BaremosRequestItem {
    ndias: String;
    baremo: String;
    dias: String;
    disponibilidad: String;
    numMinimoSimple: String;
    simpleOImporteIndividual: String;
    naPartir: String;
    maximo: String;
    porDia: String;
    idTurno: String;
    idGuardia: String;
    nomTurno: String;
    guardias: String;
    guardiasObj: GuardiaItem[];
}