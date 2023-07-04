import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoMandatosComponent } from './mantenimiento-mandatos.component';

describe('MantenimientoMandatosComponent', () => {
  let component: MantenimientoMandatosComponent;
  let fixture: ComponentFixture<MantenimientoMandatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoMandatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoMandatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
