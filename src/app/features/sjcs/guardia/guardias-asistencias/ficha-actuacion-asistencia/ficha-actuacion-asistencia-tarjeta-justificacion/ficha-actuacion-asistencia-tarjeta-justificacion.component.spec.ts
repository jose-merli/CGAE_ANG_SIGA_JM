import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionAsistenciaTarjetaJustificacionComponent } from './ficha-actuacion-asistencia-tarjeta-justificacion.component';

describe('FichaActuacionAsistenciaTarjetaJustificacionComponent', () => {
  let component: FichaActuacionAsistenciaTarjetaJustificacionComponent;
  let fixture: ComponentFixture<FichaActuacionAsistenciaTarjetaJustificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionAsistenciaTarjetaJustificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionAsistenciaTarjetaJustificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
