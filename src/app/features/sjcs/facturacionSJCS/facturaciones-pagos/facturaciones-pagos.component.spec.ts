import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionesYPagosComponent } from './facturaciones-pagos.component';

describe('FacturacionesYPagosComponent', () => {
  let component: FacturacionesYPagosComponent;
  let fixture: ComponentFixture<FacturacionesYPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionesYPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionesYPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
