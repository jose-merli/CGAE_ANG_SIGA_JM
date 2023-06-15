import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosPagosFacturasComponent } from './estados-pagos-facturas.component';

describe('EstadosPagosFacturasComponent', () => {
  let component: EstadosPagosFacturasComponent;
  let fixture: ComponentFixture<EstadosPagosFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosPagosFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosPagosFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
