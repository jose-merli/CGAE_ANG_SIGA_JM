import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioBusquedaGuardiaComponent } from './formulario-busqueda-guardia.component';


describe('FormularioBusquedaGuardiaComponent', () => {
  let component: FormularioBusquedaGuardiaComponent;
  let fixture: ComponentFixture<FormularioBusquedaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioBusquedaGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioBusquedaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
