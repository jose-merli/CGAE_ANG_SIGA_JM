import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoServiciosComponent } from './mantenimientoServicios.component';

describe('MantenimientoServiciosComponent', () => {
  let component: MantenimientoServiciosComponent;
  let fixture: ComponentFixture<MantenimientoServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoServiciosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
