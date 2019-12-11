import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBusquedaAsuntosComponent } from './filtros-busqueda-asuntos.component';

describe('FiltrosBusquedaAsuntosComponent', () => {
  let component: FiltrosBusquedaAsuntosComponent;
  let fixture: ComponentFixture<FiltrosBusquedaAsuntosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosBusquedaAsuntosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosBusquedaAsuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
