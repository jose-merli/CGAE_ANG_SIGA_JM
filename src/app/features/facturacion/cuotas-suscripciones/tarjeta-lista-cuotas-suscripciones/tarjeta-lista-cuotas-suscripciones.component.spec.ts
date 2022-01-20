import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListaCuotasSuscripcionesComponent } from './tarjeta-lista-cuotas-suscripciones.component';

describe('TarjetaListaCuotasSuscripcionesComponent', () => {
  let component: TarjetaListaCuotasSuscripcionesComponent;
  let fixture: ComponentFixture<TarjetaListaCuotasSuscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListaCuotasSuscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListaCuotasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
