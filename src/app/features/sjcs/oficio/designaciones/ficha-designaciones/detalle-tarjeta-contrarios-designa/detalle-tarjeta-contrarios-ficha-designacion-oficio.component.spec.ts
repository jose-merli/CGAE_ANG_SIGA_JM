import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './detalle-tarjeta-contrarios-ficha-designacion-oficio.component';

describe('DetalleTarjetaContrariosFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaContrariosFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaContrariosFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaContrariosFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaContrariosFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
