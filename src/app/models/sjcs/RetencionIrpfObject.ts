import { ErrorItem } from '../ErrorItem';
import { ProcuradoresItem } from './ProcuradoresItem';
import { RetencionIrpfItem } from './RetencionIrpfItem';

export class RetencionIrpfObject {
    error: ErrorItem;
    retencionItems: RetencionIrpfItem[] = [];
    constructor() { }
}