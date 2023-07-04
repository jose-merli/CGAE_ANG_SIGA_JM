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
  idCodigoDescripcion: string;
  //Value del combo del modal. Viene con valor null de back si es un presentador de ejg y relleno si es un solicitante.
  presentador: string;
  //Valor del value de presentador en el caso que no se haya seleccionado
  //un  solicitante
  idMaestroPresentador: number;
  //Lo que presenta en la tabla como presentador
  presentador_persona: string;
  parentesco: string;
  regEntrada: string;
  regSalida: string;
  idDocumentacion: number;
  idFichero: number;
  nombreFichero: string;
  idTipoEjg: number;
  anio: number;
  numero: number;
  propietario: string;
  propietarioDes: string;
  constructor() { }
}
