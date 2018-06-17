import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeFacturacionMultipleComponent } from './informe-facturacion-multiple.component';

describe('InformeFacturacionMultipleComponent', () => {
  let component: InformeFacturacionMultipleComponent;
  let fixture: ComponentFixture<InformeFacturacionMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformeFacturacionMultipleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeFacturacionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
