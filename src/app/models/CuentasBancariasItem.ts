export class CuentasBancariasItem{

    bancosCodigo;
    codBanco;
    codSucursal;
    fechaBaja: Date;
    
    iban: string = "";
    nombre: string;
    descripcion: string;
    asientoContable: string;
    cuentaContableTarjeta: string;
    bic: string;
    numUsos: number;
    numFicheros: string;

    comisionImporte: number;
    comisionDescripcion: string;
    idTipoIVA: string;
    tipoIVA: string;
    comisionCuentaContable: string;

    configFicherosSecuencia: string;
    configFicherosEsquema: string;
    configLugaresQueMasSecuencia: string;
    configConceptoAmpliado: string;

    sjcs: boolean;
    idSufijoSjcs: string;
    sufijoSjcs: string;
    concepto: string;
    
    constructor(){}
}