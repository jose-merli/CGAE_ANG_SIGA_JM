import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosNotificacionesComponent } from './datos-notificaciones.component';

describe('DatosNotificacionesComponent', () => {
  let component: DatosNotificacionesComponent;
  let fixture: ComponentFixture<DatosNotificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatosNotificacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
