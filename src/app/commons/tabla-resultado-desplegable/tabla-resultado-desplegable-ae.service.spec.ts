import { TestBed } from '@angular/core/testing';

import { TablaResultadoDesplegableAEService } from './tabla-resultado-desplegable-ae.service';

describe('TablaResultadoDesplegableAEService', () => {
  let service: TablaResultadoDesplegableAEService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoDesplegableAEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
