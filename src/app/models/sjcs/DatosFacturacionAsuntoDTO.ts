import { DatosPagoAsuntoDTO } from "./DatosPagoAsuntoDTO";

export class DatosFacturacionAsuntoDTO {
    idObjeto: string;
    importe: string;
    nombre: string;
    tipo: string;
    idPartidaPresupuestaria: string;
    importeOficio: string;
    importeGuardia: string;
    importeEjg: string;
    datosPagoAsuntoDTOList: DatosPagoAsuntoDTO[] = [];
}