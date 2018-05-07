import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSufijosComponent } from './mantenimiento-sufijos.component';

describe('MantenimientoSufijosComponent', () => {
  let component: MantenimientoSufijosComponent;
  let fixture: ComponentFixture<MantenimientoSufijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoSufijosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSufijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
