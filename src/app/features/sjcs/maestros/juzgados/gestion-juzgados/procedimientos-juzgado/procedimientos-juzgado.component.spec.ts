import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedimientosJuzgadoComponent } from './procedimientos-juzgado.component';

describe('ProcedimientosJuzgadoComponent', () => {
  let component: ProcedimientosJuzgadoComponent;
  let fixture: ComponentFixture<ProcedimientosJuzgadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcedimientosJuzgadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimientosJuzgadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
