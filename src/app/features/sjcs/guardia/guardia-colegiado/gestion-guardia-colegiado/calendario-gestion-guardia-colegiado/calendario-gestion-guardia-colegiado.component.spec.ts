import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioGestionGuardiaColegiadoComponent } from './calendario-gestion-guardia-colegiado.component';

describe('CalendarioGestionGuardiaColegiadoComponent', () => {
  let component: CalendarioGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<CalendarioGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
