import { TestBed } from '@angular/core/testing';

import { TablaResultadoMixFAService } from './tabla-resultado-mix-fa.service';

describe('TablaResultadoMixFAService', () => {
  let service: TablaResultadoMixFAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoMixFAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
