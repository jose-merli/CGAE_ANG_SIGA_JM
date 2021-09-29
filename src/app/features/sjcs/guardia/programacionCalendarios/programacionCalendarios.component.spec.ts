import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionCalendariosComponent } from './programacionCalendarios.component';

describe('ProgramacionCalendariosComponent', () => {
  let component: ProgramacionCalendariosComponent;
  let fixture: ComponentFixture<ProgramacionCalendariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramacionCalendariosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
