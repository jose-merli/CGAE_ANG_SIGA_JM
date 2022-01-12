import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaAplicacionEnPagosComponent } from './tarjeta-aplicacion-en-pagos.component';

describe('TarjetaAplicacionEnPagosComponent', () => {
  let component: TarjetaAplicacionEnPagosComponent;
  let fixture: ComponentFixture<TarjetaAplicacionEnPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaAplicacionEnPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaAplicacionEnPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
