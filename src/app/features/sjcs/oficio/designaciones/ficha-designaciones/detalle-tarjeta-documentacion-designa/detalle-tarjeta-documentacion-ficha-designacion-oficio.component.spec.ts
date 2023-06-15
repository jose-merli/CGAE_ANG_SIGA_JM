import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDocumentacionFichaDesignacionOficioComponent } from './detalle-tarjeta-documentacion-ficha-designacion-oficio.component';

describe('DetalleTarjetaDocumentacionFichaDesignacionOficioComponent', () => {
  let component: DetalleTarjetaDocumentacionFichaDesignacionOficioComponent;
  let fixture: ComponentFixture<DetalleTarjetaDocumentacionFichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDocumentacionFichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDocumentacionFichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
