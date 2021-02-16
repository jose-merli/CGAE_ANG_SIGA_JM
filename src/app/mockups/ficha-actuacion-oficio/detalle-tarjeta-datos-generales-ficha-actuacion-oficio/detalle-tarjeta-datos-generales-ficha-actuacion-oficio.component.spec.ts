import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent } from './detalle-tarjeta-datos-generales-ficha-actuacion-oficio.component';

describe('DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent', () => {
  let component: DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosGeneralesFichaActuacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
