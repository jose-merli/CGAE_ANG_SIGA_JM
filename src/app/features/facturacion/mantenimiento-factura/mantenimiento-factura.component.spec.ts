import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoFacturaComponent } from './mantenimiento-factura.component';

describe('MantenimientoFacturaComponent', () => {
  let component: MantenimientoFacturaComponent;
  let fixture: ComponentFixture<MantenimientoFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoFacturaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
