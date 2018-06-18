import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaRetencionesAplicadasComponent } from './busqueda-retenciones-aplicadas.component';

describe('BusquedaRetencionesAplicadasComponent', () => {
  let component: BusquedaRetencionesAplicadasComponent;
  let fixture: ComponentFixture<BusquedaRetencionesAplicadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaRetencionesAplicadasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaRetencionesAplicadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
