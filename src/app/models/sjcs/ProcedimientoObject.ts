import { ErrorItem } from '../ErrorItem';
import { ProcedimientoItem } from './ProcedimientoItem';

export class ProcedimientoObject {
    error: ErrorItem;
    idJuzgado: string;
    procedimientosItems: ProcedimientoItem[] = [];
    constructor() { }
}