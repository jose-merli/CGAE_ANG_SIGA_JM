import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCartasFacturacionPagoComponent } from './filtro-cartas-facturacion-pago.component';

describe('FiltroCartasFacturacionPagoComponent', () => {
  let component: FiltroCartasFacturacionPagoComponent;
  let fixture: ComponentFixture<FiltroCartasFacturacionPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroCartasFacturacionPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroCartasFacturacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
