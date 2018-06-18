import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaFacturaColegiadoComponent } from './carta-factura-colegiado.component';

describe('CartaFacturaColegiadoComponent', () => {
  let component: CartaFacturaColegiadoComponent;
  let fixture: ComponentFixture<CartaFacturaColegiadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartaFacturaColegiadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaFacturaColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
