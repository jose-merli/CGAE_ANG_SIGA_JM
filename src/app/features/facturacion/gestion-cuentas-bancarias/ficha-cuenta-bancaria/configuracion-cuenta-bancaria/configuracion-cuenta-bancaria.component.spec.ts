import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionCuentaBancariaComponent } from './configuracion-cuenta-bancaria.component';

describe('ConfiguracionCuentaBancariaComponent', () => {
  let component: ConfiguracionCuentaBancariaComponent;
  let fixture: ComponentFixture<ConfiguracionCuentaBancariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionCuentaBancariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionCuentaBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
