import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBusquedaFacturacionComponent } from './filtro-busqueda-facturacion.component';

describe('FiltroBusquedaFacturacionComponent', () => {
  let component: FiltroBusquedaFacturacionComponent;
  let fixture: ComponentFixture<FiltroBusquedaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroBusquedaFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBusquedaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
