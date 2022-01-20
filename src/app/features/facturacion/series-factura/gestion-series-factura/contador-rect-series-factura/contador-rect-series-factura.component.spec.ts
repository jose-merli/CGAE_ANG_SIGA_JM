import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorRectSeriesFacturaComponent } from './contador-rect-series-factura.component';

describe('ContadorRectSeriesFacturaComponent', () => {
  let component: ContadorRectSeriesFacturaComponent;
  let fixture: ComponentFixture<ContadorRectSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContadorRectSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContadorRectSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
