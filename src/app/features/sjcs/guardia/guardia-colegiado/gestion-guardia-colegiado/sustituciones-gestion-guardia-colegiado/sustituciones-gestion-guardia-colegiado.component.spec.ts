import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustitucionesGestionGuardiaColegiadoComponent } from './sustituciones-gestion-guardia-colegiado.component';

describe('SustitucionesGestionGuardiaColegiadoComponent', () => {
  let component: SustitucionesGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<SustitucionesGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustitucionesGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustitucionesGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
