import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBusquedaRetencionesComponent } from './filtro-busqueda-retenciones.component';

describe('FiltroBusquedaRetencionesComponent', () => {
  let component: FiltroBusquedaRetencionesComponent;
  let fixture: ComponentFixture<FiltroBusquedaRetencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBusquedaRetencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBusquedaRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
