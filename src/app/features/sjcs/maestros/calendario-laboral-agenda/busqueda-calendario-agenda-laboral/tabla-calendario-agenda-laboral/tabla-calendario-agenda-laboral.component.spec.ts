import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCalendarioAgendaLaboralComponent } from './tabla-calendario-agenda-laboral.component';

describe('TablaCalendarioAgendaLaboralComponent', () => {
  let component: TablaCalendarioAgendaLaboralComponent;
  let fixture: ComponentFixture<TablaCalendarioAgendaLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaCalendarioAgendaLaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCalendarioAgendaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
