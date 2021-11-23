import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoGestionGuardiaColegiadoComponent } from './turno-gestion-guardia-colegiado.component';

describe('TurnoGestionGuardiaColegiadoComponent', () => {
  let component: TurnoGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<TurnoGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
