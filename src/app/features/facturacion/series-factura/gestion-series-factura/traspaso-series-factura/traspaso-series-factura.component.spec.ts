import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoSeriesFacturaComponent } from './traspaso-series-factura.component';

describe('TraspasoSeriesFacturaComponent', () => {
  let component: TraspasoSeriesFacturaComponent;
  let fixture: ComponentFixture<TraspasoSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraspasoSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraspasoSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
