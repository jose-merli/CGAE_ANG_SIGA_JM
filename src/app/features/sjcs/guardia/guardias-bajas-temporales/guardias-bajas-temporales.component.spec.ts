import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasBajasTemporalesComponent } from './guardias-bajas-temporales.component';

describe('GuardiasBajasTemporalesComponent', () => {
  let component: GuardiasBajasTemporalesComponent;
  let fixture: ComponentFixture<GuardiasBajasTemporalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasBajasTemporalesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasBajasTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
