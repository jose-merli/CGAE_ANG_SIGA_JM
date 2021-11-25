export class ListaMovimientosMonederoItem{
    fecha: Date;
    concepto: string;
    cuentaContable: string;
    impOp: number;
    impTotal: number;
	liquidacion: string;
	idFactura: string;
    nLineaFactura: number;
	contabilizado: string;
	
	//Información del servicio asociado
	idServicio: number;
	idServiciosInstitucion: number;
	idTipoServicios: number;

    nuevo: boolean; //Se utiliza para determinar si es editable o no en la tabla de movimiento s de la ficha Monedero
}