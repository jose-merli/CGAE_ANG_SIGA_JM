export class FacAbonoItem {
    idAdono:number;
    motivos: String;
    fechaEmison:Date;
    fechaEmisionDesde:Date;
    fechaEmisionHasta:Date;
    contabilizada:String;
    idPersona:number;
    idCuenta:number;
    idFactura:String;
    idPagoJG:number;
    numeroAbono:String;
    observaciones:String;
	
	estado:number;
    importeTotalNeto:number;
    importeTotalIVA:number;
    importeTotal:number;
    importeTotalAbonadoEfectivo:number;
    importeTotalAbonadoBanco:number;
    importeTotalAbonado:number;
    importePendientePorAbonar:number;

    idPersonaDeudor:number;
    idCuentaDeudor:number;
	idPersonaOrigen:number;
    constructor() {}
  }
  