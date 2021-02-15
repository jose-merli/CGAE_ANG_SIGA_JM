import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosGeneralesFichaActuacionComponent } from './detalle-tarjeta-datos-generales-ficha-actuacion.component';

describe('DetalleTarjetaDatosGeneralesFichaActuacionComponent', () => {
  let component: DetalleTarjetaDatosGeneralesFichaActuacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosGeneralesFichaActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosGeneralesFichaActuacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosGeneralesFichaActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
