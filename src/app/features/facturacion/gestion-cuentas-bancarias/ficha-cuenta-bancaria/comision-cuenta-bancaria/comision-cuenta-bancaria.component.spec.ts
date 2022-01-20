import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionCuentaBancariaComponent } from './comision-cuenta-bancaria.component';

describe('ComisionCuentaBancariaComponent', () => {
  let component: ComisionCuentaBancariaComponent;
  let fixture: ComponentFixture<ComisionCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
