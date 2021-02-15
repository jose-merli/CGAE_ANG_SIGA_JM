import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaHistoricoFichaActuacionComponent } from './detalle-tarjeta-historico-ficha-actuacion.component';

describe('DetalleTarjetaHistoricoFichaActuacionComponent', () => {
  let component: DetalleTarjetaHistoricoFichaActuacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaHistoricoFichaActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaHistoricoFichaActuacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaHistoricoFichaActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
