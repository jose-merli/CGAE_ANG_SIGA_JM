import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificacionDatosComponent } from './modificacion-datos.component';

describe('ModificacionDatosComponent', () => {
  let component: ModificacionDatosComponent;
  let fixture: ComponentFixture<ModificacionDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificacionDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificacionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
