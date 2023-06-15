import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosListaSeriesFacturaComponent } from './destinatarios-lista-series-factura.component';

describe('DestinatariosListaSeriesFacturaComponent', () => {
  let component: DestinatariosListaSeriesFacturaComponent;
  let fixture: ComponentFixture<DestinatariosListaSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinatariosListaSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosListaSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
