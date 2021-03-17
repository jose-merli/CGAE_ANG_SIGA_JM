import { TestBed } from '@angular/core/testing';

import { TablaResultadoOrderCGService } from './tabla-resultado-order-cg.service';

describe('TablaResultadoOrderCGService', () => {
  let service: TablaResultadoOrderCGService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablaResultadoOrderCGService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
