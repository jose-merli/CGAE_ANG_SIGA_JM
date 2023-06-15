import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent } from './detalle-tarjeta-formas-pagos-ficha-servicios-facturacion.component';

describe('DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent', () => {
  let component: DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
