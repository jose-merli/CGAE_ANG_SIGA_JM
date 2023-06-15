import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesSeriesFacturaComponent } from './datos-generales-series-factura.component';

describe('DatosGeneralesSeriesFacturaComponent', () => {
  let component: DatosGeneralesSeriesFacturaComponent;
  let fixture: ComponentFixture<DatosGeneralesSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
