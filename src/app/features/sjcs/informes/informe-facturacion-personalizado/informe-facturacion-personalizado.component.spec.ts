import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeFacturacionPersonalizadoComponent } from './informe-facturacion-personalizado.component';

describe('InformeFacturacionPersonalizadoComponent', () => {
  let component: InformeFacturacionPersonalizadoComponent;
  let fixture: ComponentFixture<InformeFacturacionPersonalizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformeFacturacionPersonalizadoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeFacturacionPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
