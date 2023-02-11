import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasAdeudosComponent } from './facturas-adeudos.component';

describe('FacturasAdeudosComponent', () => {
  let component: FacturasAdeudosComponent;
  let fixture: ComponentFixture<FacturasAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
