import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeFacturacionComponent } from './informe-facturacion.component';

describe('InformeFacturacionComponent', () => {
  let component: InformeFacturacionComponent;
  let fixture: ComponentFixture<InformeFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformeFacturacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
