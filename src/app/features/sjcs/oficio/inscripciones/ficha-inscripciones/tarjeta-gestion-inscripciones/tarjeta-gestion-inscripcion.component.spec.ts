import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaGestionInscripcion } from './tarjeta-gestion-inscripcion.component';


describe('TarjetaGestionInscripcion', () => {
  let component: TarjetaGestionInscripcion;
  let fixture: ComponentFixture<TarjetaGestionInscripcion>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaGestionInscripcion]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaGestionInscripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
