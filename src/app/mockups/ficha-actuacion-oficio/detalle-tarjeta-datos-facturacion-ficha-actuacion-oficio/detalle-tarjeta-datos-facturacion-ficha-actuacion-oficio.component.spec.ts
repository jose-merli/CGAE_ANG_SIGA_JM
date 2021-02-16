import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent } from './detalle-tarjeta-datos-facturacion-ficha-actuacion-oficio.component';

describe('DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent', () => {
  let component: DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosFacturacionFichaActuacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
