import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaProductosCompraSuscripcionComponent } from './tarjeta-productos-compra-suscripcion.component';

describe('TarjetaProductosCompraSuscripcionComponent', () => {
  let component: TarjetaProductosCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaProductosCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaProductosCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaProductosCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
