import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoCalendariosComponent } from './resultado-calendarios.component';

describe('ResultadoCalendariosComponent', () => {
  let component: ResultadoCalendariosComponent;
  let fixture: ComponentFixture<ResultadoCalendariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoCalendariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
