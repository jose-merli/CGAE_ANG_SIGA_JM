import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaGestionInscripcionGuardiaComponent } from './tarjeta-gestion-inscripcion-guardia.component';

describe('TarjetaGestionInscripcionGuardiaComponent', () => {
  let component: TarjetaGestionInscripcionGuardiaComponent;
  let fixture: ComponentFixture<TarjetaGestionInscripcionGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaGestionInscripcionGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaGestionInscripcionGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
