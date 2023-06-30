import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs';

@Injectable()
export class SigaStorageService {
  isLetrado: any;
  idPersona: any;
  numColegiado: any;
  nombreApe: string;
  institucionActual: string;
  version: string = '1.0.96_0'
  constructor() { }

}
