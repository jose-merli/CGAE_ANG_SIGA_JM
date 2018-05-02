import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoDuplicadosComponent } from './mantenimiento-duplicados.component';

describe('MantenimientoMandatosComponent', () => {
  let component: MantenimientoDuplicadosComponent;
  let fixture: ComponentFixture<MantenimientoDuplicadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoDuplicadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoDuplicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
