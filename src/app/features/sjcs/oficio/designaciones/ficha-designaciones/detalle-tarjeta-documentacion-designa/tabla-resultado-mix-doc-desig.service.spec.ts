import { TestBed, inject } from '@angular/core/testing';

import { TablaResultadoMixDocDesigService } from './tabla-resultado-mix-doc-desig.service';

describe('TablaResultadoMixDocDesigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablaResultadoMixDocDesigService]
    });
  });

  it('should be created', inject([TablaResultadoMixDocDesigService], (service: TablaResultadoMixDocDesigService) => {
    expect(service).toBeTruthy();
  }));
});
