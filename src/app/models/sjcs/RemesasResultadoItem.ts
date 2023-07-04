export class RemesasResultadoItem{

    idRemesaResultado?: number;
    numRemesaPrefijo?: string;
    numRemesaNumero?: string;
    numRemesaSufijo?: string;
    numRegistroPrefijo?: string;
    numRegistroNumero?: string;
    numRegistroSufijo?: string;
    nombreFichero?: string;
    fechaRemesaDesde?: string;
	fechaRemesaHasta?: string;
    fechaCargaDesde?: string;
    fechaCargaHasta?: string;

    observacionesRemesaResultado?: string;
    fechaCargaRemesaResultado?: string;
    fechaResolucionRemesaResultado?: string;
    idRemesa?: number;
    numeroRemesa?: string;
    prefijoRemesa?: string;
    sufijoRemesa?: string;
    descripcionRemesa?: string;

    numRegistroRemesaCompleto?:  number;
    numRemesaCompleto?: string;

    constructor(obj: Object) {
        this.idRemesaResultado = obj['idRemesaResultado'];
        this.numRemesaPrefijo = obj['numRemesaPrefijo'];
        this.numRemesaNumero = obj['numRemesaNumero'];
        this.numRemesaSufijo = obj['numRemesaSufijo'];
        this.numRegistroPrefijo = obj['numRegistroPrefijo'];
        this.numRegistroNumero = obj['numRegistroNumero'];
        this.numRegistroSufijo = obj['numRegistroSufijo'];
        this.nombreFichero = obj['nombreFichero'];
        this.fechaRemesaDesde = obj['fechaRemesaDesde'];
        this.fechaRemesaHasta = obj['fechaRemesaHasta'];
        this.fechaCargaDesde = obj['fechaCargaDesde'];
        this.fechaCargaHasta = obj['fechaCargaHasta'];
        this.observacionesRemesaResultado = obj['observacionesRemesaResultado'];
        this.fechaCargaRemesaResultado = obj['fechaCargaRemesaResultado'];
        this.fechaResolucionRemesaResultado = obj['fechaResolucionRemesaResultado'];
        this.idRemesa = obj['idRemesa'];
        this.numeroRemesa = obj['numeroRemesa'];
        this.prefijoRemesa = obj['prefijoRemesa'];
        this.sufijoRemesa = obj['sufijoRemesa'];
        this.descripcionRemesa = obj['descripcionRemesa'];
        this.numRegistroRemesaCompleto = obj['numRegistroRemesaCompleto'];
        this.numRemesaCompleto = obj['numRemesaCompleto'];

     }
     
}