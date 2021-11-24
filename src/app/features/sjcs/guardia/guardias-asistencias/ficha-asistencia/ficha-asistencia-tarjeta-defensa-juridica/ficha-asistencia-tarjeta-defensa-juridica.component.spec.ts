import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaDefensaJuridicaComponent } from './ficha-asistencia-tarjeta-defensa-juridica.component';

describe('FichaAsistenciaTarjetaDefensaJuridicaComponent', () => {
  let component: FichaAsistenciaTarjetaDefensaJuridicaComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaDefensaJuridicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaDefensaJuridicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaDefensaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
