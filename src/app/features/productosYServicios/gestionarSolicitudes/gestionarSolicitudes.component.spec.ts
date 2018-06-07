import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSolicitudesComponent } from './gestionarSolicitudes.component';

describe('GestionarSolicitudesComponent', () => {
  let component: GestionarSolicitudesComponent;
  let fixture: ComponentFixture<GestionarSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionarSolicitudesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
