export class CuentasBancariasItem{

    bancosCodigo;
    codBanco;
    codSucursal;
    fechaBaja;
    
    iban: string = "";
    nombre: string;
    descripcion: string;
    asientoContable: string;
    cuentaContableTarjeta: string;
    bic: string;
    numUsos: string;
    numFicheros: string;

    comisionImporte: string;
    comisionDescripcion: string;
    idTipoIVA: string;

    configFicherosSecuencia: string;
    configFicherosEsquema: string;
    configLugaresQueMasSecuencia: string;
    configConceptoAmpliado: string;

    sjcs: string;
    idSufijoSjcs: string;
    concepto: string;
    
    constructor(){}
}