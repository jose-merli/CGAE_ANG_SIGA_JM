import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaFormasPagosFichaProductoFacturacionComponent } from './detalle-tarjeta-formas-pagos-ficha-producto-facturacion.component';

describe('DetalleTarjetaFormasPagosFichaProductoFacturacionComponent', () => {
  let component: DetalleTarjetaFormasPagosFichaProductoFacturacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaFormasPagosFichaProductoFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaFormasPagosFichaProductoFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaFormasPagosFichaProductoFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
