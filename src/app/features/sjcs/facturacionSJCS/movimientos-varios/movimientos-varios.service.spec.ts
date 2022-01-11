import { TestBed, inject } from '@angular/core/testing';

import { MovimientosVariosService } from './movimientos-varios.service';

describe('MovimientosVariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovimientosVariosService]
    });
  });

  it('should be created', inject([MovimientosVariosService], (service: MovimientosVariosService) => {
    expect(service).toBeTruthy();
  }));
});
