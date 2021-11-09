import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaFacturacionComponent } from './tarjeta-facturacion.component';

describe('TarjetaFacturacionComponent', () => {
  let component: TarjetaFacturacionComponent;
  let fixture: ComponentFixture<TarjetaFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
