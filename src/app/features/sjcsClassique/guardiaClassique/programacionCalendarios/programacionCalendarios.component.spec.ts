import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionCalendariosClassiqueComponent } from './programacionCalendarios.component';

describe('ProgramacionCalendariosClassiqueComponent', () => {
  let component: ProgramacionCalendariosClassiqueComponent;
  let fixture: ComponentFixture<ProgramacionCalendariosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramacionCalendariosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionCalendariosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
