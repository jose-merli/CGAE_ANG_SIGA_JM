import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaSolicitudCompraSuscripcionComponent } from './tarjeta-solicitud-compra-suscripcion.component';

describe('TarjetaSolicitudCompraSuscripcionComponent', () => {
  let component: TarjetaSolicitudCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaSolicitudCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaSolicitudCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaSolicitudCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
