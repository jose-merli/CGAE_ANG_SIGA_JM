import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiasSolicitudesTurnosClassiqueComponent } from './solicitudes-turnos.component';

describe('GuardiasSolicitudesTurnosClassiqueComponent', () => {
  let component: GuardiasSolicitudesTurnosClassiqueComponent;
  let fixture: ComponentFixture<GuardiasSolicitudesTurnosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasSolicitudesTurnosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasSolicitudesTurnosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
