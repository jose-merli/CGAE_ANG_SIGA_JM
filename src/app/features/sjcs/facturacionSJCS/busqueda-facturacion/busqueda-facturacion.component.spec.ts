import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaFacturacionComponent } from './busqueda-facturacion.component';

describe('BusquedaFacturacionComponent', () => {
  let component: BusquedaFacturacionComponent;
  let fixture: ComponentFixture<BusquedaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
