import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermutasGestionGuardiaColegiadoComponent } from './permutas-gestion-guardia-colegiado.component';

describe('PermutasGestionGuardiaColegiadoComponent', () => {
  let component: PermutasGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<PermutasGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermutasGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermutasGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
