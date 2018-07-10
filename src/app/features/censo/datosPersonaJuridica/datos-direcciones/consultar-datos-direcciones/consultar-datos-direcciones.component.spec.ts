import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDatosDireccionesComponent } from './consultar-datos-direcciones.component';

describe('ConsultarDatosDireccionesComponent', () => {
  let component: ConsultarDatosDireccionesComponent;
  let fixture: ComponentFixture<ConsultarDatosDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarDatosDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDatosDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
