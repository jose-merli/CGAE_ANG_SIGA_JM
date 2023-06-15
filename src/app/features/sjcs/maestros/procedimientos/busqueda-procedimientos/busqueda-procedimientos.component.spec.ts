import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaProcedimientosComponent } from './busqueda-procedimientos.component';

describe('BusquedaProcedimientosComponent', () => {
  let component: BusquedaProcedimientosComponent;
  let fixture: ComponentFixture<BusquedaProcedimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaProcedimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaProcedimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
