import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaRelacionesComponent } from './ficha-asistencia-tarjeta-relaciones.component';

describe('FichaAsistenciaTarjetaRelacionesComponent', () => {
  let component: FichaAsistenciaTarjetaRelacionesComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaRelacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaRelacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaRelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
