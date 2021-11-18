import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFiltroCuotasSuscripcionesComponent } from './tarjeta-filtro-cuotas-suscripciones.component';

describe('TarjetaFiltroCuotasSuscripcionesComponent', () => {
  let component: TarjetaFiltroCuotasSuscripcionesComponent;
  let fixture: ComponentFixture<TarjetaFiltroCuotasSuscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFiltroCuotasSuscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFiltroCuotasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
