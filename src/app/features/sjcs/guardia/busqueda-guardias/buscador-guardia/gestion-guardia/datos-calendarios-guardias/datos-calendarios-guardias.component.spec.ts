import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCalendariosGuardiasComponent } from './datos-calendarios-guardias.component';

describe('DatosCalendariosGuardiasComponent', () => {
  let component: DatosCalendariosGuardiasComponent;
  let fixture: ComponentFixture<DatosCalendariosGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCalendariosGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCalendariosGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
