import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaResumenFijaComponent } from './tarjeta-resumen-fija.component';


describe('TarjetaResumenFijaComponent', () => {
  let component: TarjetaResumenFijaComponent;
  let fixture: ComponentFixture<TarjetaResumenFijaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaResumenFijaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaResumenFijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
