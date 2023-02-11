import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesTurnosGuardiasClassiqueComponent } from './solicitudesTurnosGuardias.component';

describe('SolicitudesTurnosGuardiasClassiqueComponent', () => {
  let component: SolicitudesTurnosGuardiasClassiqueComponent;
  let fixture: ComponentFixture<SolicitudesTurnosGuardiasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesTurnosGuardiasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesTurnosGuardiasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
