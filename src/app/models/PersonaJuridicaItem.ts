export class PersonaJuridicaItem {
  tipo: String;
  nif: String;
  denominacion: String;
  fechaConstitucion: Date;
  integrante: String;
  grupos: any[] = []; // etiquetas en pantalla
  sociedadesProfesionales: boolean;
  abreviatura: String;
  numeroIntegrantes: number;
  constructor() {}
}
