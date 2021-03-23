import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GlobalGuardiasService {

    public isConfEmitter$: BehaviorSubject<ConfiguracionCola>;
    configuracionCola: ConfiguracionCola = {
            'manual': false,
            'porGrupos': false
        };
    constructor( 
    ) {
        this.isConfEmitter$ = new BehaviorSubject<ConfiguracionCola>(this.configuracionCola);
    }

    emitConf(conf: ConfiguracionCola): void {
        this.isConfEmitter$.next(conf)
    }

    getConf() {
        return this.isConfEmitter$;
    }
}

export class ConfiguracionCola {
    constructor(
        public manual: boolean,
        public porGrupos: boolean
    ) { }
}

