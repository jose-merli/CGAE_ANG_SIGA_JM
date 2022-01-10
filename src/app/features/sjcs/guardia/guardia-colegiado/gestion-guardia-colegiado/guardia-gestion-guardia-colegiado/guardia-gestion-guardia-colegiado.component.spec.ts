import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaGestionGuardiaColegiadoComponent } from './guardia-gestion-guardia-colegiado.component';

describe('GuardiaGestionGuardiaColegiadoComponent', () => {
  let component: GuardiaGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<GuardiaGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardiaGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiaGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
