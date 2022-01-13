import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaRetencionesComponent } from './tabla-busqueda-retenciones.component';

describe('TablaBusquedaRetencionesComponent', () => {
  let component: TablaBusquedaRetencionesComponent;
  let fixture: ComponentFixture<TablaBusquedaRetencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaRetencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaRetencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
