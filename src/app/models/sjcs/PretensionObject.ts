import { ErrorItem } from '../ErrorItem';
import { PrisionItem } from './PrisionItem';
import { PretensionItem } from './PretensionItem';

export class PretensionObject {
    error: ErrorItem;
    pretensionItems: PretensionItem[] = [];
    constructor() { }
}