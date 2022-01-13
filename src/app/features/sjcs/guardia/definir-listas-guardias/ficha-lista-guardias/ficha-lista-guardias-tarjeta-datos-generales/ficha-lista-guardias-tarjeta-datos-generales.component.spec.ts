import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaListaGuardiasTarjetaDatosGeneralesComponent } from './ficha-lista-guardias-tarjeta-datos-generales.component';

describe('FichaListaGuardiasTarjetaDatosGeneralesComponent', () => {
  let component: FichaListaGuardiasTarjetaDatosGeneralesComponent;
  let fixture: ComponentFixture<FichaListaGuardiasTarjetaDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaListaGuardiasTarjetaDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaListaGuardiasTarjetaDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
