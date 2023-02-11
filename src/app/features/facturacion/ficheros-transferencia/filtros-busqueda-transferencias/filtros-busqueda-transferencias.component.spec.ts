import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBusquedaTransferenciasComponent } from './filtros-busqueda-transferencias.component';

describe('FiltrosBusquedaTransferenciasComponent', () => {
  let component: FiltrosBusquedaTransferenciasComponent;
  let fixture: ComponentFixture<FiltrosBusquedaTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosBusquedaTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosBusquedaTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
