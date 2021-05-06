import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGuardiaComponent } from './gestion-guardia.component';

describe('GestionGuardiaComponent', () => {
  let component: GestionGuardiaComponent;
  let fixture: ComponentFixture<GestionGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
