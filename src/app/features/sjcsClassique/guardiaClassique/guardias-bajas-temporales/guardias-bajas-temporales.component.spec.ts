import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasBajasTemporalesClassiqueComponent } from './guardias-bajas-temporales.component';

describe('GuardiasBajasTemporalesClassiqueComponent', () => {
  let component: GuardiasBajasTemporalesClassiqueComponent;
  let fixture: ComponentFixture<GuardiasBajasTemporalesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasBajasTemporalesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasBajasTemporalesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
