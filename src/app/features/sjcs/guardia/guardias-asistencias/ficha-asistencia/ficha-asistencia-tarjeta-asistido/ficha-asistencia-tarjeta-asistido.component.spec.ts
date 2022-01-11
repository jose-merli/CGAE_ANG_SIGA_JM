import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaAsistidoComponent } from './ficha-asistencia-tarjeta-asistido.component';

describe('FichaAsistenciaTarjetaAsistidoComponent', () => {
  let component: FichaAsistenciaTarjetaAsistidoComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaAsistidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaAsistidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaAsistidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
