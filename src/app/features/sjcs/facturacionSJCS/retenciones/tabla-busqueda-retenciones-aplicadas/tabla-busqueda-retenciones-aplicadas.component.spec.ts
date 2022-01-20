import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaRetencionesAplicadasComponent } from './tabla-busqueda-retenciones-aplicadas.component';

describe('TablaBusquedaRetencionesAplicadasComponent', () => {
  let component: TablaBusquedaRetencionesAplicadasComponent;
  let fixture: ComponentFixture<TablaBusquedaRetencionesAplicadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaRetencionesAplicadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaRetencionesAplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
