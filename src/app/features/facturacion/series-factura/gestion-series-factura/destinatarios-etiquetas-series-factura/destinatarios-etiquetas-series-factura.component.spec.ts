import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosEtiquetasSeriesFacturaComponent } from './destinatarios-etiquetas-series-factura.component';

describe('DestinatariosEtiquetasSeriesFacturaComponent', () => {
  let component: DestinatariosEtiquetasSeriesFacturaComponent;
  let fixture: ComponentFixture<DestinatariosEtiquetasSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinatariosEtiquetasSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosEtiquetasSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
