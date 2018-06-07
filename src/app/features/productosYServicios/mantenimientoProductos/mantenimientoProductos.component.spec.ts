import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoProductosComponent } from './mantenimientoProductos.component';

describe('MantenimientoProductosComponent', () => {
  let component: MantenimientoProductosComponent;
  let fixture: ComponentFixture<MantenimientoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoProductosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
