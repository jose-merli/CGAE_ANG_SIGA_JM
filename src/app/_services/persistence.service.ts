
import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class PersistenceService {

    historico: boolean;
    filtros: any;

    clearPersistence() {
        this.filtros = undefined;
        this.historico = undefined;
    }
}
