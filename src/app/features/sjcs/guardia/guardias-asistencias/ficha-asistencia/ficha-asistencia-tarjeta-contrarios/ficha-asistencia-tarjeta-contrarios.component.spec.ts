import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaContrariosComponent } from './ficha-asistencia-tarjeta-contrarios.component';

describe('FichaAsistenciaTarjetaContrariosComponent', () => {
  let component: FichaAsistenciaTarjetaContrariosComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaContrariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaContrariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaContrariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
