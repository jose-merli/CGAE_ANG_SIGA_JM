import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosIndividualesSeriesFacturaComponent } from './destinatarios-individuales-series-factura.component';

describe('DestinatariosIndividualesSeriesFacturaComponent', () => {
  let component: DestinatariosIndividualesSeriesFacturaComponent;
  let fixture: ComponentFixture<DestinatariosIndividualesSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinatariosIndividualesSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosIndividualesSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
