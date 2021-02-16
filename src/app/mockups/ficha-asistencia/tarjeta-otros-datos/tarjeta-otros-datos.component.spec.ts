import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaOtrosDatosComponent } from './tarjeta-otros-datos.component';

describe('TarjetaOtrosDatosComponent', () => {
  let component: TarjetaOtrosDatosComponent;
  let fixture: ComponentFixture<TarjetaOtrosDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaOtrosDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaOtrosDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
