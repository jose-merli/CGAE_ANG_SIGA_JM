import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSeriesFacturaComponent } from './gestion-series-factura.component';

describe('GestionSeriesFacturaComponent', () => {
  let component: GestionSeriesFacturaComponent;
  let fixture: ComponentFixture<GestionSeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionSeriesFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionSeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
