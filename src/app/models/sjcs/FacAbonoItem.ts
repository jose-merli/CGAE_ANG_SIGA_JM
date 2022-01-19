export class FacAbonoItem {
    idAbono:number;
    motivos: String;
    fechaEmision:Date;
    fechaEmisionDesde:Date;
    fechaEmisionHasta:Date;
    contabilizada:String;
    idPersona:number;
    idCuenta:number;
    idFactura:String;
    idFacturacion:String;
    idPagoJG:number;
    numeroAbono:String;
    observaciones:String;
    numFacturaCompensada:String;

	estado:number;
    estadoNombre: String;
    forma:String;
    importeTotalNeto:number;
    importeTotalIVA:number;
    importeTotal:number;
    importeTotalDesde:number;
    importeTotalHasta:number;
    importeTotalAbonadoEfectivo:number;
    importeTotalAbonadoBanco:number;
    importeTotalAbonado:number;
    importePendientePorAbonar:number;

    idPersonaDeudor:number;
    idCuentaDeudor:number;
	idPersonaOrigen:number;
    
    //Filtros - Agrupacion
    grupoFacturacionNombre:String;
    pagoDesde:Date;
    pagoHasta:Date;
    identificadorFicheroT:number;
    grupoPago:String;

    //Filtros - Colegiado
    colegioNombre:String;
    numColegiado:number;
    numIdentificadorColegiado:number;
    apellidosColegiado:String;
    nombreColegiado:String;

    //Filtros - Sociedad
    colegioNombreSociedad:String;
    numIdentificadorSociedad:number;
    nombreSociedad:String;
    abreviaturaSociedad:String;
    nombreCompleto:String;
    nombreGeneral:String;
    apellidosGeneral:String;
    ncolident:String;

    //Aux
    nombrePago:String;
    nombreFacturacion:String;
    idInstitucion: String;
    constructor() {}
  }
  