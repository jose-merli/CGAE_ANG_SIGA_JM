import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesFacturaClassiqueComponent } from './series-factura.component';

describe('SeriesFacturaClassiqueComponent', () => {
  let component: SeriesFacturaClassiqueComponent;
  let fixture: ComponentFixture<SeriesFacturaClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesFacturaClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesFacturaClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
