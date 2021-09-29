import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaInscripcion } from './tarjeta-inscripcion.component';


describe('ConfiguracionTurnosComponent', () => {
  let component: TarjetaInscripcion;
  let fixture: ComponentFixture<TarjetaInscripcion>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaInscripcion]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaInscripcion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
