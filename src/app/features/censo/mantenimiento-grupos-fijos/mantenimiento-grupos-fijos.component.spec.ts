import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoGruposFijosComponent } from './mantenimiento-grupos-fijos.component';

describe('MantenimientoGruposFijosComponent', () => {
  let component: MantenimientoGruposFijosComponent;
  let fixture: ComponentFixture<MantenimientoGruposFijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoGruposFijosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoGruposFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
