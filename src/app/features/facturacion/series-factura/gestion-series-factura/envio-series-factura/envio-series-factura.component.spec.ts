import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioSeriesFacturaComponent } from './envio-series-factura.component';

describe('EnvioSeriesFacturaComponent', () => {
  let component: EnvioSeriesFacturaComponent;
  let fixture: ComponentFixture<EnvioSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvioSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
