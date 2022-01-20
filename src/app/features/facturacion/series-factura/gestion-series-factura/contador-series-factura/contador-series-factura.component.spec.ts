import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorSeriesFacturaComponent } from './contador-series-factura.component';

describe('ContadorSeriesFacturaComponent', () => {
  let component: ContadorSeriesFacturaComponent;
  let fixture: ComponentFixture<ContadorSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContadorSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContadorSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
