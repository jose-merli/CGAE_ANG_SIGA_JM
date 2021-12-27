export class ListaMovimientosMonederoItem{
    fecha: Date;
    concepto: string;
    cuentaContable: string;
    impOp: number;
    impTotal: number;

    nuevo: boolean; //Se utiliza para determinar si es editable o no en la tabla de movimiento s de la ficha Monedero
}