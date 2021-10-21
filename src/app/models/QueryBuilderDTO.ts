import { DatosGeneralesConsultaItem } from "./DatosGeneralesConsultaItem";
import { QueryBuilderItem } from "./QueryBuilderItem";

export class QueryBuilderDTO {
    idConsulta: string;

    condition: string;
	rules: QueryBuilderItem[] = [];
	error: Error;
    constructor() { }
  }
  