import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaColaGuardias } from './tarjeta-colaguardias.component';


describe('ConfiguracionTurnosComponent', () => {
  let component: TarjetaColaGuardias;
  let fixture: ComponentFixture<TarjetaColaGuardias>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaColaGuardias]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColaGuardias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
