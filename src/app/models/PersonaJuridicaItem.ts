export class PersonaJuridicaItem {
	tipo: String;
	tipoSociedad: String;
	nif: String;
	denominacion: String;
	fechaConstitucion: Date;
	integrante: String;
	grupos: any[] = []; // etiquetas en pantalla
	sociedadesProfesionales: boolean;
	abreviatura: String;
	numeroIntegrantes: number;
	nombresIntegrantes: String;
	idPersona: String;
	idPersonaDelete: String[] = [];
	fechaBaja: Date;
	constructor() {}
}
