import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensacionFacturaComponent } from './compensacion-factura.component';

describe('CompensacionFacturaComponent', () => {
  let component: CompensacionFacturaComponent;
  let fixture: ComponentFixture<CompensacionFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompensacionFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensacionFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
