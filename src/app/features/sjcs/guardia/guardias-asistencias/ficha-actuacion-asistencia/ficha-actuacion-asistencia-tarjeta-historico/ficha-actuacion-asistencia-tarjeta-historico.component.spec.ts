import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionAsistenciaTarjetaHistoricoComponent } from './ficha-actuacion-asistencia-tarjeta-historico.component';

describe('FichaActuacionAsistenciaTarjetaHistoricoComponent', () => {
  let component: FichaActuacionAsistenciaTarjetaHistoricoComponent;
  let fixture: ComponentFixture<FichaActuacionAsistenciaTarjetaHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionAsistenciaTarjetaHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionAsistenciaTarjetaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
