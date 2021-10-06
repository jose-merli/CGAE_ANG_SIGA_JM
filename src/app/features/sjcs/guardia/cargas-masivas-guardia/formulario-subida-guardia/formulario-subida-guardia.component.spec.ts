import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioSubidaGuardiaComponent } from './formulario-subida-guardia.component';


describe('FormularioSubidaGuardiaComponent', () => {
  let component: FormularioSubidaGuardiaComponent;
  let fixture: ComponentFixture<FormularioSubidaGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioSubidaGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioSubidaGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
