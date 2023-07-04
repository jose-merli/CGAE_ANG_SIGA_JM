import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaSancionesComponent } from './busqueda-sanciones.component';

describe('BusquedaSancionesComponent', () => {
  let component: BusquedaSancionesComponent;
  let fixture: ComponentFixture<BusquedaSancionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusquedaSancionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaSancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
