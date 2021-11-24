import { ErrorItem } from '../ErrorItem';
import { CertificacionFacItem } from './CertificacionFacItem';

export class CertificacionFacObject {
    error: ErrorItem;
    certificacionFacItems: CertificacionFacItem[] = [];
    constructor() { }
}