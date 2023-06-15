import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioBusquedaComponent } from './formulario-busqueda.component';

describe('FormularioBusquedaComponent', () => {
  let component: FormularioBusquedaComponent;
  let fixture: ComponentFixture<FormularioBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
