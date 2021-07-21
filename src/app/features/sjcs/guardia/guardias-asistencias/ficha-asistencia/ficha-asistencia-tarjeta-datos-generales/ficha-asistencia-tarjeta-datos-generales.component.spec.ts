import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaDatosGeneralesComponent } from './ficha-asistencia-tarjeta-datos-generales.component';

describe('FichaAsistenciaTarjetaDatosGeneralesComponent', () => {
  let component: FichaAsistenciaTarjetaDatosGeneralesComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
