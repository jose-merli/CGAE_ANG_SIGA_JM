import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaInscripcionesComponent } from './busqueda-inscripciones.component';

describe('BusquedaInscripcionesComponent', () => {
  let component: BusquedaInscripcionesComponent;
  let fixture: ComponentFixture<BusquedaInscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaInscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
