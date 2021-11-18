import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListaCompraProductosComponent } from './tarjeta-lista-compra-productos.component';

describe('TarjetaListaCompraProductosComponent', () => {
  let component: TarjetaListaCompraProductosComponent;
  let fixture: ComponentFixture<TarjetaListaCompraProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListaCompraProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListaCompraProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
