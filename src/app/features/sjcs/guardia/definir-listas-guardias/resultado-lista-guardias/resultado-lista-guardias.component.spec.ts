import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoListaGuardiasComponent } from './resultado-lista-guardias.component';

describe('ResultadoListaGuardiasComponent', () => {
  let component: ResultadoListaGuardiasComponent;
  let fixture: ComponentFixture<ResultadoListaGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoListaGuardiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoListaGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
