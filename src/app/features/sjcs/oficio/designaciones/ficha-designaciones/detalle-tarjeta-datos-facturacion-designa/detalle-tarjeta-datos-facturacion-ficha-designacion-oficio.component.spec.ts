import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent } from './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component';

describe('DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
