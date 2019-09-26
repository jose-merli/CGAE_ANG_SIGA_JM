import { ErrorItem } from '../ErrorItem';
import { PrisionItem } from './PrisionItem';

export class PrisionObject {
    error: ErrorItem;
    prisionItems: PrisionItem[] = [];
    constructor() { }
}