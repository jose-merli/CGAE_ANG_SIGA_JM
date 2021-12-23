import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {  TarjetaDatosGeneralesCertificacionComponent  } from './tarjeta-datos-generales-certificacion.component';

describe(' TarjetaDatosGeneralesCertificacionComponent ', () => {
  let component:  TarjetaDatosGeneralesCertificacionComponent ;
  let fixture: ComponentFixture< TarjetaDatosGeneralesCertificacionComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  TarjetaDatosGeneralesCertificacionComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( TarjetaDatosGeneralesCertificacionComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
