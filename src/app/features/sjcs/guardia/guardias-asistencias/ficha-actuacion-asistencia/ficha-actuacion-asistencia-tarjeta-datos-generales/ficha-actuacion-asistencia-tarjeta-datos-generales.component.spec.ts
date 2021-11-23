import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionAsistenciaTarjetaDatosGeneralesComponent } from './ficha-actuacion-asistencia-tarjeta-datos-generales.component';

describe('FichaActuacionAsistenciaTarjetaDatosGeneralesComponent', () => {
  let component: FichaActuacionAsistenciaTarjetaDatosGeneralesComponent;
  let fixture: ComponentFixture<FichaActuacionAsistenciaTarjetaDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionAsistenciaTarjetaDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionAsistenciaTarjetaDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
