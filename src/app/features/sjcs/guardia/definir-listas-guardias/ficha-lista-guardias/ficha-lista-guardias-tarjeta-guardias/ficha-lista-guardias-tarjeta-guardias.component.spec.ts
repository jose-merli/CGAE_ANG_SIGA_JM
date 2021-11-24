import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaListaGuardiasTarjetaGuardiasComponent } from './ficha-lista-guardias-tarjeta-guardias.component';

describe('FichaListaGuardiasTarjetaGuardiasComponent', () => {
  let component: FichaListaGuardiasTarjetaGuardiasComponent;
  let fixture: ComponentFixture<FichaListaGuardiasTarjetaGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaListaGuardiasTarjetaGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaListaGuardiasTarjetaGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
