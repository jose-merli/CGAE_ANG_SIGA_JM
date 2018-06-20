import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesFacturaComponent } from './series-factura.component';

describe('SeriesFacturaComponent', () => {
  let component: SeriesFacturaComponent;
  let fixture: ComponentFixture<SeriesFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
