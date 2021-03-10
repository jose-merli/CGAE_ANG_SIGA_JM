import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaCalendariosComponent } from './pantalla-calendarios.component';

describe('PantallaCalendariosComponent', () => {
  let component: PantallaCalendariosComponent;
  let fixture: ComponentFixture<PantallaCalendariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaCalendariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
