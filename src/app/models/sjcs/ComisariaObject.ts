import { ErrorItem } from '../ErrorItem';
import { CosteFijoItem } from './CosteFijoItem';
import { ComisariaItem } from './ComisariaItem';

export class ComisariaObject {
    error: ErrorItem;
    comisariaItems: ComisariaItem[] = [];
    constructor() { }
}