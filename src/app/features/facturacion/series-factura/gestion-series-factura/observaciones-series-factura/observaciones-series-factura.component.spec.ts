import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesSeriesFacturaComponent } from './observaciones-series-factura.component';

describe('ObservacionesSeriesFacturaComponent', () => {
  let component: ObservacionesSeriesFacturaComponent;
  let fixture: ComponentFixture<ObservacionesSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
