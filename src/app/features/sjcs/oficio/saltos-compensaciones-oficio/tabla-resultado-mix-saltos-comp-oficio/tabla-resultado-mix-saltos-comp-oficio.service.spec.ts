import { TestBed, inject } from '@angular/core/testing';

import { TablaResultadoMixSaltosCompOficioService } from './tabla-resultado-mix-saltos-comp-oficio.service';

describe('TablaResultadoMixSaltosCompOficioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TablaResultadoMixSaltosCompOficioService]
    });
  });

  it('should be created', inject([TablaResultadoMixSaltosCompOficioService], (service: TablaResultadoMixSaltosCompOficioService) => {
    expect(service).toBeTruthy();
  }));
});
