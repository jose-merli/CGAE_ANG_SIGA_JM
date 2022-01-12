import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFacturacionGenericaComponent } from './tarjeta-facturacion-generica.component';

describe('TarjetaFacturacionGenericaComponent', () => {
  let component: TarjetaFacturacionGenericaComponent;
  let fixture: ComponentFixture<TarjetaFacturacionGenericaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFacturacionGenericaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFacturacionGenericaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
