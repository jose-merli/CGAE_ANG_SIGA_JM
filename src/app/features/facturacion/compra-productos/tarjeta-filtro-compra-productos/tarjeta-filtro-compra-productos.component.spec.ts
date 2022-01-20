import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFiltroCompraProductosComponent } from './tarjeta-filtro-compra-productos.component';

describe('TarjetaFiltroCompraProductosComponent', () => {
  let component: TarjetaFiltroCompraProductosComponent;
  let fixture: ComponentFixture<TarjetaFiltroCompraProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFiltroCompraProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFiltroCompraProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
