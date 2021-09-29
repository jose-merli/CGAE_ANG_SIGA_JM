import { TestBed } from '@angular/core/testing';

import { TablaResultadoMixFCService } from './tabla-resultado-mix-fc.service';

describe('TablaResultadoMixFCService', () => {
  let service: TablaResultadoMixFCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoMixFCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
