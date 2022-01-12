import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaResumenMovimientosComponent } from './tarjeta-resumen-movimientos.component';

describe('TarjetaResumenMovimientosComponent', () => {
  let component: TarjetaResumenMovimientosComponent;
  let fixture: ComponentFixture<TarjetaResumenMovimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaResumenMovimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaResumenMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
