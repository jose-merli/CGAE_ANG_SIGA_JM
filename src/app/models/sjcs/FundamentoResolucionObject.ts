import { ErrorItem } from '../ErrorItem';
import { JuzgadoItem } from './JuzgadoItem';
import { FundamentoResolucionItem } from './FundamentoResolucionItem';

export class FundamentoResolucionObject {
    error: ErrorItem;
    fundamentoResolucionItems: FundamentoResolucionItem[] = [];
    constructor() { }
}