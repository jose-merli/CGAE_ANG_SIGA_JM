import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionFacturasComponent } from './facturacion-facturas.component';

describe('FacturacionFacturasComponent', () => {
  let component: FacturacionFacturasComponent;
  let fixture: ComponentFixture<FacturacionFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
