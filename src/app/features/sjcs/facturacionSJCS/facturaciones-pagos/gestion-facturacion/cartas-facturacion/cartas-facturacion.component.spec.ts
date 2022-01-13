import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasFacturacionComponent } from './cartas-facturacion.component';

describe('CartasFacturacionComponent', () => {
  let component: CartasFacturacionComponent;
  let fixture: ComponentFixture<CartasFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartasFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartasFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
