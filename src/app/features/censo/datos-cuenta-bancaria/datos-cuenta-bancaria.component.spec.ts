import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCuentaBancariaComponent } from './datos-cuenta-bancaria.component';

describe('DatosCuentaBancariaComponent', () => {
  let component: DatosCuentaBancariaComponent;
  let fixture: ComponentFixture<DatosCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
