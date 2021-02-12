import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPantallaCalendariosComponent } from './resultado-pantalla-calendarios.component';

describe('ResultadoPantallaCalendariosComponent', () => {
  let component: ResultadoPantallaCalendariosComponent;
  let fixture: ComponentFixture<ResultadoPantallaCalendariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoPantallaCalendariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPantallaCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
