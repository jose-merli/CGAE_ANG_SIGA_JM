import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaTarjetaCaracteristicasComponent } from './ficha-asistencia-tarjeta-caracteristicas.component';

describe('FichaAsistenciaTarjetaCaracteristicasComponent', () => {
  let component: FichaAsistenciaTarjetaCaracteristicasComponent;
  let fixture: ComponentFixture<FichaAsistenciaTarjetaCaracteristicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaTarjetaCaracteristicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaTarjetaCaracteristicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
