import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent } from './detalle-tarjeta-datos-generales-ficha-productos-facturacion.component';

describe('DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent', () => {
  let component: DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
