import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoComisariasComponent } from './mantenimiento-comisarias.component';

describe('MantenimientoComisariasComponent', () => {
  let component: MantenimientoComisariasComponent;
  let fixture: ComponentFixture<MantenimientoComisariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoComisariasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoComisariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
