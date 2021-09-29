import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasSolicitudesTurnosComponent } from './solicitudes-turnos.component';

describe('GuardiasSolicitudesTurnosComponent', () => {
  let component: GuardiasSolicitudesTurnosComponent;
  let fixture: ComponentFixture<GuardiasSolicitudesTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasSolicitudesTurnosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasSolicitudesTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
