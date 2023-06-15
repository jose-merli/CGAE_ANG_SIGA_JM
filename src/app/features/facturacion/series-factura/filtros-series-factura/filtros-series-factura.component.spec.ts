import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSeriesFacturaComponent } from './filtros-series-factura.component';

describe('FiltrosSeriesFacturaComponent', () => {
  let component: FiltrosSeriesFacturaComponent;
  let fixture: ComponentFixture<FiltrosSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
