import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDescuentosAnticiposCompraSuscripcionComponent } from './tarjeta-descuentos-anticipos-compra-suscripcion.component';

describe('TarjetaDescuentosAnticiposCompraSuscripcionComponent', () => {
  let component: TarjetaDescuentosAnticiposCompraSuscripcionComponent;
  let fixture: ComponentFixture<TarjetaDescuentosAnticiposCompraSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDescuentosAnticiposCompraSuscripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDescuentosAnticiposCompraSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
