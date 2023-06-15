import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaFundamentosresolucionComponent } from './busqueda-fundamentosresolucion.component';

describe('BusquedaFundamentosresolucionComponent', () => {
  let component: BusquedaFundamentosresolucionComponent;
  let fixture: ComponentFixture<BusquedaFundamentosresolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaFundamentosresolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaFundamentosresolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
