import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaFacturacionComponent } from './tabla-busqueda-facturacion.component';

describe('TablaBusquedaFacturacionComponent', () => {
  let component: TablaBusquedaFacturacionComponent;
  let fixture: ComponentFixture<TablaBusquedaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBusquedaFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
