import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent } from './detalle-tarjeta-datos-generales-ficha-designacion-oficio.component';

describe('DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
