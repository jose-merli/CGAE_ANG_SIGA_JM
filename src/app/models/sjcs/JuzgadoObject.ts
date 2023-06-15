import { ErrorItem } from '../ErrorItem';
import { JuzgadoItem } from './JuzgadoItem';

export class JuzgadoObject {
    error: ErrorItem;
    juzgadoItems: JuzgadoItem[] = [];
    constructor() { }
}