import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBusquedaAdeudosComponent } from './filtros-busqueda-adeudos.component';

describe('FiltrosBusquedaAdeudosComponent', () => {
  let component: FiltrosBusquedaAdeudosComponent;
  let fixture: ComponentFixture<FiltrosBusquedaAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosBusquedaAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosBusquedaAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
