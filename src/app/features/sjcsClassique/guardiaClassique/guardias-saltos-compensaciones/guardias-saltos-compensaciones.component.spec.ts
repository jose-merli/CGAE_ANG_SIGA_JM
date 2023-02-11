import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasSaltosCompensacionesClassiqueComponent } from './guardias-saltos-compensaciones.component';

describe('GuardiasSaltosCompensacionesClassiqueComponent', () => {
  let component: GuardiasSaltosCompensacionesClassiqueComponent;
  let fixture: ComponentFixture<GuardiasSaltosCompensacionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasSaltosCompensacionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasSaltosCompensacionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
