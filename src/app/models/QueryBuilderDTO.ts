import { DatosGeneralesConsultaItem } from "./DatosGeneralesConsultaItem";
import { QueryBuilderItem } from "./QueryBuilderItem";

export class QueryBuilderDTO {
    idconsulta: string;
    consulta: string;

    condition: string;
	rules: QueryBuilderItem[] = [];
	error: Error;
    constructor() { }
  }
  