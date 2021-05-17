import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaColaFijaComponent } from './tarjeta-cola-fija.component';


describe('TarjetaColaFijaComponent', () => {
  let component: TarjetaColaFijaComponent;
  let fixture: ComponentFixture<TarjetaColaFijaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaColaFijaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaColaFijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
