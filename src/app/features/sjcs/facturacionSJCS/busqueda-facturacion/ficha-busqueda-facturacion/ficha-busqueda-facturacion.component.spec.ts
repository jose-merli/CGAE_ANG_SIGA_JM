import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBusquedaFacturacionComponent } from './ficha-busqueda-facturacion.component';

describe('FichaBusquedaFacturacionComponent', () => {
  let component: FichaBusquedaFacturacionComponent;
  let fixture: ComponentFixture<FichaBusquedaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBusquedaFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBusquedaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
