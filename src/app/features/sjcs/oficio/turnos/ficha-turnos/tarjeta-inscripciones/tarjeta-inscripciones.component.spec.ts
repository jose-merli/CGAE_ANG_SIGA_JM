import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaInscripciones } from './tarjeta-inscripciones.component';


describe('ConfiguracionTurnosComponent', () => {
  let component: TarjetaInscripciones;
  let fixture: ComponentFixture<TarjetaInscripciones>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaInscripciones]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaInscripciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
