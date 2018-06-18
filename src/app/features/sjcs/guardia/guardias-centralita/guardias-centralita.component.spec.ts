import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasCentralitaComponent } from './guardias-centralita.component';

describe('GuardiasCentralitaComponent', () => {
  let component: GuardiasCentralitaComponent;
  let fixture: ComponentFixture<GuardiasCentralitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasCentralitaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasCentralitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
