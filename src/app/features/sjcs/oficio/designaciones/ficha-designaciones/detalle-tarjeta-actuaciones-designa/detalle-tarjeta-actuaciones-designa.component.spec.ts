import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaActuacionesFichaDesignacionOficioComponent } from './detalle-tarjeta-actuaciones-designa.component';

describe('DetalleTarjetaActuacionesFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaActuacionesFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaActuacionesFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaActuacionesFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaActuacionesFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
