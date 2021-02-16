import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTarjetaDocumentacionFichaActuacionComponent } from './detalle-tarjeta-documentacion-ficha-actuacion.component';

describe('DetalleTarjetaDocumentacionFichaActuacionComponent', () => {
  let component: DetalleTarjetaDocumentacionFichaActuacionComponent;
  let fixture: ComponentFixture<DetalleTarjetaDocumentacionFichaActuacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTarjetaDocumentacionFichaActuacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTarjetaDocumentacionFichaActuacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
