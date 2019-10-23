import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCalendarioAgendaLaboralComponent } from './busqueda-calendario-agenda-laboral.component';

describe('BusquedaCalendarioAgendaLaboralComponent', () => {
  let component: BusquedaCalendarioAgendaLaboralComponent;
  let fixture: ComponentFixture<BusquedaCalendarioAgendaLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaCalendarioAgendaLaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCalendarioAgendaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
