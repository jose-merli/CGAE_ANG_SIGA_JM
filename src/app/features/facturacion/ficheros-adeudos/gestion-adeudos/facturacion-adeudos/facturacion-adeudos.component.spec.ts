import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionAdeudosComponent } from './facturacion-adeudos.component';

describe('FacturacionAdeudosComponent', () => {
  let component: FacturacionAdeudosComponent;
  let fixture: ComponentFixture<FacturacionAdeudosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturacionAdeudosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionAdeudosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
