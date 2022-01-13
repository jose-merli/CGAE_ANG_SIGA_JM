export class FacRegistroFichContaItem {
    idContabilidad:number;
	idContabilidadDesde:number;
	idContabilidadHasta:number;
	fechaCreacion: Date;
    fechaCreacionDesde: Date;
	fechaCreacionHasta: Date;
	fechaExportacionDesde: Date;
	fechaExportacionHasta: Date;
	numAsientos:number;
	numAsientosDesde:number;
    numAsientosHasta:number;
	fechaModificacion: Date;
	nombreFichero:String;
	estado:number;
    nombreEstado:String;
	nuevo:boolean= false;
  
    constructor() {}
  }
  