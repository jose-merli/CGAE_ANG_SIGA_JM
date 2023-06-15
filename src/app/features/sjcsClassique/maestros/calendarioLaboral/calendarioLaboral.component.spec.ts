import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioLaboralClassiqueComponent } from './calendarioLaboral.component';

describe('CalendarioLaboralClassiqueComponent', () => {
  let component: CalendarioLaboralClassiqueComponent;
  let fixture: ComponentFixture<CalendarioLaboralClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarioLaboralClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioLaboralClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
