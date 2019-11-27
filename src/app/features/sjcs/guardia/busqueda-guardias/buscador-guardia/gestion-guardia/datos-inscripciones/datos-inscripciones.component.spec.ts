import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosInscripcionesComponent } from './datos-inscripciones.component';

describe('DatosInscripcionesComponent', () => {
  let component: DatosInscripcionesComponent;
  let fixture: ComponentFixture<DatosInscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosInscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
