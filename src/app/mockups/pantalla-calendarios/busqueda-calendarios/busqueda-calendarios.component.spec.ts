import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCalendariosComponent } from './busqueda-calendarios.component';

describe('BusquedaCalendariosComponent', () => {
  let component: BusquedaCalendariosComponent;
  let fixture: ComponentFixture<BusquedaCalendariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaCalendariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCalendariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
