import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportacionSeriesFacturaComponent } from './exportacion-series-factura.component';

describe('ExportacionSeriesFacturaComponent', () => {
  let component: ExportacionSeriesFacturaComponent;
  let fixture: ComponentFixture<ExportacionSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportacionSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportacionSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
