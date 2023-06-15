import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaGuardias } from './tarjeta-guardias.component';


describe('ConfiguracionTurnosComponent', () => {
  let component: TarjetaGuardias;
  let fixture: ComponentFixture<TarjetaGuardias>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaGuardias]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaGuardias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
