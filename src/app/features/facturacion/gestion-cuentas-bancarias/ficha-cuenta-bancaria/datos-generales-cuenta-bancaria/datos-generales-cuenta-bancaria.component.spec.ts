import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesCuentaBancariaComponent } from './datos-generales-cuenta-bancaria.component';

describe('DatosGeneralesCuentaBancariaComponent', () => {
  let component: DatosGeneralesCuentaBancariaComponent;
  let fixture: ComponentFixture<DatosGeneralesCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
