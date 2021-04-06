import { TestBed } from '@angular/core/testing';

import { TablaResultadoDesplegableJEService } from './tabla-resultado-desplegable-je.service';

describe('TablaResultadoDesplegableJEService', () => {
  let service: TablaResultadoDesplegableJEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoDesplegableJEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
