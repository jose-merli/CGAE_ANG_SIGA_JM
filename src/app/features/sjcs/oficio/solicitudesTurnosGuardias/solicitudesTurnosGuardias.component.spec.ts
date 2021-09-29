import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesTurnosGuardiasComponent } from './solicitudesTurnosGuardias.component';

describe('SolicitudesTurnosGuardiasComponent', () => {
  let component: SolicitudesTurnosGuardiasComponent;
  let fixture: ComponentFixture<SolicitudesTurnosGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesTurnosGuardiasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesTurnosGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
