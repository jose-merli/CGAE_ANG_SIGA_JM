export class DocumentacionEjgItem {
  abreviaturaTipoDoc: string;
  descripcionTipoDoc: string;
  abreviaturaDoc: string;
  descripcionDoc: string; 
  historico: boolean;
  flimite_presentacion: Date;
  f_presentacion: Date;
  fechaModificacion: string;
  codigodescripcion: string;
  codigoExt: string;
  idTipoDocumento: number;
  idDocumento: number;
  labelDocumento: string;
//Value del combo del modal. Viene con valor null de back
  presentador: string;
  //Valor del value de presentador en el caso que no se haya seleccionado
  //un  solicitante
  idMaestroPresentador: number;
  parentesco: string;
  //Lo que presenta en la tabla
  presentador_persona: string;
  regEntrada: string;
	regSalida: string;
  idDocumentacion: number;
  idFichero: number;
  nombreFichero: string;
  idTipoEjg: number;
	anio: number;
	numero: number;
  constructor() { }
}
