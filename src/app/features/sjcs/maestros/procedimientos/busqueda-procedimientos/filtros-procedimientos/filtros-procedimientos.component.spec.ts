import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosProcedimientosComponent } from './filtros-procedimientos.component';

describe('FiltrosProcedimientosComponent', () => {
  let component: FiltrosProcedimientosComponent;
  let fixture: ComponentFixture<FiltrosProcedimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosProcedimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosProcedimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
