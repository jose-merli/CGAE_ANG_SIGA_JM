import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesModificacionComponent } from './solicitudes-modificacion.component';

describe('SolicitudesModificacionComponent', () => {
  let component: SolicitudesModificacionComponent;
  let fixture: ComponentFixture<SolicitudesModificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesModificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
