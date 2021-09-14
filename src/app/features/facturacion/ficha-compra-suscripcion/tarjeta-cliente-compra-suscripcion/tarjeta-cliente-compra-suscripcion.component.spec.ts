import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaClienteCompraSuscripcionComponent } from './tarjeta-cliente-compra-suscripcion.component';

describe('TarjetaClienteCompraSuscripcionComponent', () => {
  let component: TarjetaClienteCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaClienteCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaClienteCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaClienteCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
