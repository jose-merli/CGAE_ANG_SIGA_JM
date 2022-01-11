import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasPagoComponent } from './cartas-pago.component';

describe('CartasPagoComponent', () => {
  let component: CartasPagoComponent;
  let fixture: ComponentFixture<CartasPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartasPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartasPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
