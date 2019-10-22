import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaProcedimientosComponent } from './tabla-procedimientos.component';

describe('TablaProcedimientosComponent', () => {
  let component: TablaProcedimientosComponent;
  let fixture: ComponentFixture<TablaProcedimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaProcedimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaProcedimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
