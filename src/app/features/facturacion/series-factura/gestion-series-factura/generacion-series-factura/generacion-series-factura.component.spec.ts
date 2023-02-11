import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionSeriesFacturaComponent } from './generacion-series-factura.component';

describe('GeneracionSeriesFacturaComponent', () => {
  let component: GeneracionSeriesFacturaComponent;
  let fixture: ComponentFixture<GeneracionSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneracionSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
