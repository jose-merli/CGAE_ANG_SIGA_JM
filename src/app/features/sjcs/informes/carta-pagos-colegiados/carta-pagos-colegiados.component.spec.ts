import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaPagosColegiadosComponent } from './carta-pagos-colegiados.component';

describe('CartaPagosColegiadosComponent', () => {
  let component: CartaPagosColegiadosComponent;
  let fixture: ComponentFixture<CartaPagosColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartaPagosColegiadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaPagosColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
