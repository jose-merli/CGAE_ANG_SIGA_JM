import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFormaPagoCompraSuscripcionComponent } from './tarjeta-forma-pago-compra-suscripcion.component';

describe('TarjetaFormaPagoCompraSuscripcionComponent', () => {
  let component: TarjetaFormaPagoCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaFormaPagoCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFormaPagoCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFormaPagoCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
