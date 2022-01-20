export class ListaComprasProductosItem{
    apellidosNombre: string;
    concepto: string;
    estadoFactura: string;
    fechaEfectiva: Date;
    fechaSolicitud: Date;
    idEstadoSolicitud: string;
    idFormaPago: string;
    importe: string;
    nColegiado: string;
    nIdentificacion: string;
    nSolicitud: string;
    fechaDenegada: Date;
	fechaSolicitadaAnulacion: Date;
	fechaAnulada: Date;
	desFormaPago: string;
    idPersona: string;
	solicitarBaja: string; //En este caso representa si todos los servicios tienen el valor "solicitarBaja" a 1 o no. 
	//Se realiza una resta de los valores con el numero de columnas. Si no es 0, un colegiado no puede solicitar una anulación.
	facturas: string;
}