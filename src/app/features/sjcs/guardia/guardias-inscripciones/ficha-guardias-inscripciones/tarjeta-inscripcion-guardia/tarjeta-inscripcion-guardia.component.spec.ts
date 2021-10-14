import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaInscripcionGuardiaComponent } from './tarjeta-inscripcion-guardia.component';

describe('TarjetaInscripcionGuardiaComponent', () => {
  let component: TarjetaInscripcionGuardiaComponent;
  let fixture: ComponentFixture<TarjetaInscripcionGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaInscripcionGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaInscripcionGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
