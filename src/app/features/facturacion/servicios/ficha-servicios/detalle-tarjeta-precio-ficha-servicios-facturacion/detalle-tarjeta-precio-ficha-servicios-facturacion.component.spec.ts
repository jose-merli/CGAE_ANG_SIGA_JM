import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaPrecioFichaServiciosFacturacionComponent } from './detalle-tarjeta-precio-ficha-servicios-facturacion.component';

describe('DetalleTarjetaPrecioFichaServiciosFacturacionComponent', () => {
  let component: DetalleTarjetaPrecioFichaServiciosFacturacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaPrecioFichaServiciosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaPrecioFichaServiciosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaPrecioFichaServiciosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
