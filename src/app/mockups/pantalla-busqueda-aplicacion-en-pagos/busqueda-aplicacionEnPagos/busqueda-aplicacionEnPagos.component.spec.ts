import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaAplicacionEnPagosComponent } from './busqueda-aplicacionEnPagos.component';

describe('BusquedaAplicacionEnPagosComponent', () => {
  let component: BusquedaAplicacionEnPagosComponent;
  let fixture: ComponentFixture<BusquedaAplicacionEnPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaAplicacionEnPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaAplicacionEnPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
