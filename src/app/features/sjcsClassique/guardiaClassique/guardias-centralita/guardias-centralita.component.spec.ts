import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasCentralitaClassiqueComponent } from './guardias-centralita.component';

describe('GuardiasCentralitaClassiqueComponent', () => {
  let component: GuardiasCentralitaClassiqueComponent;
  let fixture: ComponentFixture<GuardiasCentralitaClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasCentralitaClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasCentralitaClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
