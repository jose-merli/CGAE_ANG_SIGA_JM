import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioLaboralComponent } from './calendarioLaboral.component';

describe('CalendarioLaboralComponent', () => {
  let component: CalendarioLaboralComponent;
  let fixture: ComponentFixture<CalendarioLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioLaboralComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
