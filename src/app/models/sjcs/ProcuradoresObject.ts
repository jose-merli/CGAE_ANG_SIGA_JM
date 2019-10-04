import { ErrorItem } from '../ErrorItem';
import { ProcuradoresItem } from './ProcuradoresItem';

export class ProcuradoresObject {
    error: ErrorItem;
    procuradorItems: ProcuradoresItem[] = [];
    constructor() { }
}