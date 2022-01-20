import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoAutomaticoSeriesFacturaComponent } from './pago-automatico-series-factura.component';

describe('PagoAutomaticoSeriesFacturaComponent', () => {
  let component: PagoAutomaticoSeriesFacturaComponent;
  let fixture: ComponentFixture<PagoAutomaticoSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoAutomaticoSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoAutomaticoSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
