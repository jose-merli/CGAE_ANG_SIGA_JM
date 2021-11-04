import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaServiciosCompraSuscripcionComponent } from './tarjeta-servicios-compra-suscripcion.component';

describe('TarjetaServiciosCompraSuscripcionComponent', () => {
  let component: TarjetaServiciosCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaServiciosCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaServiciosCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaServiciosCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
