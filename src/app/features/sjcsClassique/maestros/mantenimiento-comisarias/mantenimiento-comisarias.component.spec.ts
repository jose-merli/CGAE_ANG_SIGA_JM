import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoComisariasClassiqueComponent } from './mantenimiento-comisarias.component';

describe('MantenimientoComisariasClassiqueComponent', () => {
  let component: MantenimientoComisariasClassiqueComponent;
  let fixture: ComponentFixture<MantenimientoComisariasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoComisariasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoComisariasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
