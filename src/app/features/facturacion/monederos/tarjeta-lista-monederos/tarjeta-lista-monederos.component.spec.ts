import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaListaMonederosComponent } from './tarjeta-lista-monederos.component';

describe('TarjetaListaCompraProductosComponent', () => {
  let component: TarjetaListaMonederosComponent;
  let fixture: ComponentFixture<TarjetaListaMonederosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaListaMonederosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaListaMonederosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
