import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCartasFacturacionPagoComponent } from './tabla-cartas-facturacion-pago.component';

describe('TablaCartasFacturacionPagoComponent', () => {
  let component: TablaCartasFacturacionPagoComponent;
  let fixture: ComponentFixture<TablaCartasFacturacionPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaCartasFacturacionPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCartasFacturacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
