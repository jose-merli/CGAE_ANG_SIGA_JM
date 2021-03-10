import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaJustificacionFichaActuacionOficioComponent } from './detalle-tarjeta-justificacion-ficha-actuacion-oficio.component';

describe('DetalleTarjetaJustificacionFichaActuacionOficioComponent', () => {
  let component: DetalleTarjetaJustificacionFichaActuacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaJustificacionFichaActuacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaJustificacionFichaActuacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaJustificacionFichaActuacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
