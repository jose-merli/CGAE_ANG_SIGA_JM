import { TestBed } from '@angular/core/testing';

import { TablaResultadoMixDAService } from './tabla-resultado-mix-da.service';

describe('TablaResultadoMixDAService', () => {
  let service: TablaResultadoMixDAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoMixDAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
