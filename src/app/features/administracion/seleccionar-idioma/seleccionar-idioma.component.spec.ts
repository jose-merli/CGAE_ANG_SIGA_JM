import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarIdioma } from './seleccionar-idioma.component';

describe('HomeComponent', () => {
  let component: SeleccionarIdioma;
  let fixture: ComponentFixture<SeleccionarIdioma>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeleccionarIdioma]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarIdioma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
