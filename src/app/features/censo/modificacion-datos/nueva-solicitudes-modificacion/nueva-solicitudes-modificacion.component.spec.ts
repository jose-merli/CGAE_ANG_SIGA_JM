import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaSolicitudesModificacionComponent } from './nueva-solicitudes-modificacion.component';

describe('NuevaSolicitudesModificacionComponent', () => {
  let component: NuevaSolicitudesModificacionComponent;
  let fixture: ComponentFixture<NuevaSolicitudesModificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaSolicitudesModificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaSolicitudesModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
