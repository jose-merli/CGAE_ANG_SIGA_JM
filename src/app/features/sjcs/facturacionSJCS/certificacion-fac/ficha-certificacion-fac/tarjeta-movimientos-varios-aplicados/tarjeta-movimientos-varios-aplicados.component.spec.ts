import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaMovimientosVariosAplicadosComponent } from './tarjeta-movimientos-varios-aplicados.component';

describe('TarjetaMovimientosVariosAplicadosComponent', () => {
  let component: TarjetaMovimientosVariosAplicadosComponent;
  let fixture: ComponentFixture<TarjetaMovimientosVariosAplicadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaMovimientosVariosAplicadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaMovimientosVariosAplicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
