import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasFacturacionPagoComponent } from './cartas-facturacion-pago.component';

describe('CartasFacturacionPagoComponent', () => {
  let component: CartasFacturacionPagoComponent;
  let fixture: ComponentFixture<CartasFacturacionPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartasFacturacionPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartasFacturacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
