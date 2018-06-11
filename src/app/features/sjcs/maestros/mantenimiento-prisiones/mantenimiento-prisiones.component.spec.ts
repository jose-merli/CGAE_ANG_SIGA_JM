import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPrisionesComponent } from './mantenimiento-prisiones.component';

describe('MantenimientoPrisionesComponent', () => {
  let component: MantenimientoPrisionesComponent;
  let fixture: ComponentFixture<MantenimientoPrisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoPrisionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPrisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
