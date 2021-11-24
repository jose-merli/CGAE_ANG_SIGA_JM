import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasInscripcionesComponent } from './guardias-inscripciones.component';

describe('GuardiasInscripcionesComponent', () => {
  let component: GuardiasInscripcionesComponent;
  let fixture: ComponentFixture<GuardiasInscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardiasInscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
