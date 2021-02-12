import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaPantallaCalendariosComponent } from './busqueda-pantalla-calendarios.component';

describe('BusquedaPantallaCalendariosComponent', () => {
  let component: BusquedaPantallaCalendariosComponent;
  let fixture: ComponentFixture<BusquedaPantallaCalendariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaPantallaCalendariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaPantallaCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
