import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaGuardiasInscripcionesComponent } from './ficha-guardias-inscripciones.component';

describe('FichaGuardiasInscripcionesComponent', () => {
  let component: FichaGuardiasInscripcionesComponent;
  let fixture: ComponentFixture<FichaGuardiasInscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaGuardiasInscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaGuardiasInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
