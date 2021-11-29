import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs';

@Injectable()
export class SigaStorageService {
  isLetrado: any;
  idPersona: any;
  numColegiado: any;
  institucionActual: string;
  version: string = '1.0.75_0'
  constructor() { }

}
