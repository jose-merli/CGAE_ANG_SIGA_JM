import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCuentaBancariaComponent } from './ficha-cuenta-bancaria.component';

describe('FichaCuentaBancariaComponent', () => {
  let component: FichaCuentaBancariaComponent;
  let fixture: ComponentFixture<FichaCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
