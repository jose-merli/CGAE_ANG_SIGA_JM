import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaActuacionesComponent } from './ficha-asistencia-tarjeta-actuaciones.component';

describe('FichaAsistenciaTarjetaActuacionesComponent', () => {
  let component: FichaAsistenciaTarjetaActuacionesComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaActuacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaActuacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaActuacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
