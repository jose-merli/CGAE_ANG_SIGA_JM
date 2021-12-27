import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGuardiaColegiadoComponent } from './gestion-guardia-colegiado.component';

describe('GestionGuardiaColegiadoComponent', () => {
  let component: GestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<GestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
