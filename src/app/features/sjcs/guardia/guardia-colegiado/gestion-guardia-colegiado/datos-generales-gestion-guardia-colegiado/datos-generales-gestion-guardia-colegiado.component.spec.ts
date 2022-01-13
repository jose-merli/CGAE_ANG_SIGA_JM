import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesGestionGuardiaColegiadoComponent } from './datos-generales-gestion-guardia-colegiado.component';

describe('DatosGeneralesGestionGuardiaColegiadoComponent', () => {
  let component: DatosGeneralesGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<DatosGeneralesGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
