import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoFacturacionComponent } from './mantenimiento-facturacion.component';

describe('MantenimientoFacturacionComponent', () => {
  let component: MantenimientoFacturacionComponent;
  let fixture: ComponentFixture<MantenimientoFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoFacturacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
