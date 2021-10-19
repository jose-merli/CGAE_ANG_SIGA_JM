import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFacturaCompraSuscripcionComponent } from './tarjeta-factura-compra-suscripcion.component';

describe('TarjetaFacturaCompraSuscripcionComponent', () => {
  let component: TarjetaFacturaCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaFacturaCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFacturaCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFacturaCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
