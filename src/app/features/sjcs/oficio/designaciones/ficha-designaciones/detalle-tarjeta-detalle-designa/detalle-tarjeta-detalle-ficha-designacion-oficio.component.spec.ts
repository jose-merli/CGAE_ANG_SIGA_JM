import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDetalleFichaDesignacionOficioComponent } from './detalle-tarjeta-detalle-ficha-designacion-oficio.component';

describe('DetalleTarjetaDetalleFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaDetalleFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDetalleFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDetalleFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDetalleFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
