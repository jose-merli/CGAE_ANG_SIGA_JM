import { EventEmitter } from '@angular/core';

export class EjgService {

    $eventEmitter = new EventEmitter;

    emitirEvento(dato ?: any) {
        this.$eventEmitter.emit(dato);
    }

}