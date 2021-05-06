import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosIncripcionesGuardiasComponent } from './datos-incripciones-guardias.component';

describe('DatosIncripcionesGuardiasComponent', () => {
  let component: DatosIncripcionesGuardiasComponent;
  let fixture: ComponentFixture<DatosIncripcionesGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosIncripcionesGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosIncripcionesGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
