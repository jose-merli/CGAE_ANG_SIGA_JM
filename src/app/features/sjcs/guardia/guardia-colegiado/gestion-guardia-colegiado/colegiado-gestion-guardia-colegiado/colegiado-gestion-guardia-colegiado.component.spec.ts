import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColegiadoGestionGuardiaColegiadoComponent } from './colegiado-gestion-guardia-colegiado.component';

describe('ColegiadoGestionGuardiaColegiadoComponent', () => {
  let component: ColegiadoGestionGuardiaColegiadoComponent;
  let fixture: ComponentFixture<ColegiadoGestionGuardiaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColegiadoGestionGuardiaColegiadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColegiadoGestionGuardiaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
