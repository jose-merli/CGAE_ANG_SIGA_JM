import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent } from './detalle-tarjeta-datos-generales-ficha-servicios-facturacion.component';

describe('DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent', () => {
  let component: DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
