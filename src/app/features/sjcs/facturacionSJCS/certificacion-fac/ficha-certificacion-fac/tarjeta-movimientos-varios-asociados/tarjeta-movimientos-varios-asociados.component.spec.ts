import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaMovimientosVariosAsociadosComponent } from './tarjeta-movimientos-varios-asociados.component';

describe('TarjetaMovimientosVariosAsociadosComponent', () => {
  let component: TarjetaMovimientosVariosAsociadosComponent;
  let fixture: ComponentFixture<TarjetaMovimientosVariosAsociadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaMovimientosVariosAsociadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaMovimientosVariosAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
