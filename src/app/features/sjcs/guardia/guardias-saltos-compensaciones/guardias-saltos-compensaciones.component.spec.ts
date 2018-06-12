import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasSaltosCompensacionesComponent } from './guardias-saltos-compensaciones.component';

describe('GuardiasSaltosCompensacionesComponent', () => {
  let component: GuardiasSaltosCompensacionesComponent;
  let fixture: ComponentFixture<GuardiasSaltosCompensacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasSaltosCompensacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasSaltosCompensacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
