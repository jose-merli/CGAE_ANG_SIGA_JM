import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetaLetradoComponent } from './tarjeta-letrado.component';


describe('DatosGeneralesConsultaComponent', () => {
  let component: TarjetaLetradoComponent;
  let fixture: ComponentFixture<TarjetaLetradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaLetradoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaLetradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
