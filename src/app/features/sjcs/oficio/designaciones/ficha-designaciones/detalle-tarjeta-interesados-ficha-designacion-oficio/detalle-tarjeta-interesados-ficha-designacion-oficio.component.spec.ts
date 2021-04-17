import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaInteresadosFichaDesignacionOficioComponent } from './detalle-tarjeta-interesados-ficha-designacion-oficio.component';

describe('DetalleTarjetaInteresadosFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaInteresadosFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaInteresadosFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaInteresadosFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaInteresadosFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
