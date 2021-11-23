import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaObservacionesComponent } from './ficha-asistencia-tarjeta-observaciones.component';

describe('FichaAsistenciaTarjetaObservacionesComponent', () => {
  let component: FichaAsistenciaTarjetaObservacionesComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
