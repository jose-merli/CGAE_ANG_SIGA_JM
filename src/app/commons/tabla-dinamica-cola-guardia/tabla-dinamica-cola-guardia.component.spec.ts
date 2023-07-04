import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDinamicaColaGuardiaComponent } from './tabla-dinamica-cola-guardia.component';

describe('TablaDinamicaColaGuardiaComponent', () => {
  let component: TablaDinamicaColaGuardiaComponent;
  let fixture: ComponentFixture<TablaDinamicaColaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TablaDinamicaColaGuardiaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDinamicaColaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
