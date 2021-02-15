import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaJustificacionFichaActuacionComponent } from './detalle-tarjeta-justificacion-ficha-actuacion.component';

describe('DetalleTarjetaJustificacionFichaActuacionComponent', () => {
  let component: DetalleTarjetaJustificacionFichaActuacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaJustificacionFichaActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaJustificacionFichaActuacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaJustificacionFichaActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
