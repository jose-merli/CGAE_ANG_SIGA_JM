import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaColaOficio } from './tarjeta-colaoficio.component';


describe('ConfiguracionTurnosComponent', () => {
  let component: TarjetaColaOficio;
  let fixture: ComponentFixture<TarjetaColaOficio>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaColaOficio]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColaOficio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
