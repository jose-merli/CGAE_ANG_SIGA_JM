import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaEntidadDevolucionesComponent } from './cuenta-entidad-devoluciones.component';

describe('CuentaEntidadDevolucionesComponent', () => {
  let component: CuentaEntidadDevolucionesComponent;
  let fixture: ComponentFixture<CuentaEntidadDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaEntidadDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaEntidadDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
