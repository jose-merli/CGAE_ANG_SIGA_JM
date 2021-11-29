import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasDevolucionesComponent } from './facturas-devoluciones.component';

describe('FacturasDevolucionesComponent', () => {
  let component: FacturasDevolucionesComponent;
  let fixture: ComponentFixture<FacturasDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturasDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
