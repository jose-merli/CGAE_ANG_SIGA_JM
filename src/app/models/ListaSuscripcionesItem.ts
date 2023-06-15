export class ListaSuscripcionesItem {
	
	fechaSolicitud : Date;
	nSolicitud : string; //Equivaldria al idpeticion de la tabla pys_peticioncomprasuscripcion
	nIdentificacion: string;  //de la persona asociada a la suscrpicion (cliente)
	nColegiado: string;  //si el comprador es colegiado de ese colegio.
	apellidosNombre: string; // de la persona asociada a la suscrpicion.
	concepto: string; // nombre del servicio solicitado. En caso de haber varios, mostrar el primero añadido y añadir puntos suspensivos. Se mostrará como un link.
	idFormaPago: string;  // forma de pago utilizada
	importe: string;  // valor aplicado durante la suscrpicion (importe total)
	idEstadoSolicitud: string;  // ver estados en Ficha Compra/Suscripción > Tarjeta Solicitud.
	fechaEfectiva: Date; 
	fechaDenegada: Date;
	fechaSolicitadaAnulacion: Date;
	fechaAnulada: Date;
	desFormaPago: string; 
	precioPerio: string;  
	fechaSuscripcion: Date; // fecha cuando se acepta la solicitud
	fechaBaja: Date;
	idEstadoFactura: string;
	idPersona: string;
	solicitarBaja: string; //En este caso representa si todos los servicios tienen el valor "solicitarBaja" a 1 o no. 
	//Se realiza una resta de los valores con el numero de columnas. Si no es 0, un colegiado no puede solicitar una anulación.
	facturas: string;
	automatico: string;
	idTipoServicios:string;
	idServicio:string;
	idServiciosInstitucion:string;
}