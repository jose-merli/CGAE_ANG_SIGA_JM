import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaGestionFichaActuacionOficoComponent } from './detalle-tarjeta-gestion-ficha-actuacion-ofico.component';

describe('DetalleTarjetaGestionFichaActuacionOficoComponent', () => {
  let component: DetalleTarjetaGestionFichaActuacionOficoComponent;
  let fixture: ComponentFixture<DetalleTarjetaGestionFichaActuacionOficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaGestionFichaActuacionOficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaGestionFichaActuacionOficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
