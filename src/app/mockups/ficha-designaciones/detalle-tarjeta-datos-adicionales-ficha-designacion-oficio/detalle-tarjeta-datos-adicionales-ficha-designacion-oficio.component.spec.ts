import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent } from './detalle-tarjeta-datos-adicionales-ficha-designacion-oficio.component';

describe('DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDatosAdicionalesFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
