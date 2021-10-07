import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSeriesFacturaComponent } from './tabla-series-factura.component';

describe('TablaSeriesFacturaComponent', () => {
  let component: TablaSeriesFacturaComponent;
  let fixture: ComponentFixture<TablaSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
