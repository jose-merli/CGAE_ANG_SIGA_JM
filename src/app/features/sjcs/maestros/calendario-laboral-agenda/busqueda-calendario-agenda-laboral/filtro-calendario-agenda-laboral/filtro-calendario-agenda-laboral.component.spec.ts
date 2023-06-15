import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCalendarioAgendaLaboralComponent } from './filtro-calendario-agenda-laboral.component';

describe('FiltroCalendarioAgendaLaboralComponent', () => {
  let component: FiltroCalendarioAgendaLaboralComponent;
  let fixture: ComponentFixture<FiltroCalendarioAgendaLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroCalendarioAgendaLaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroCalendarioAgendaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
