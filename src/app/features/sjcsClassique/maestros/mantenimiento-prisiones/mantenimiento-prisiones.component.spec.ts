import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPrisionesClassiqueComponent } from './mantenimiento-prisiones.component';

describe('MantenimientoPrisionesClassiqueComponent', () => {
  let component: MantenimientoPrisionesClassiqueComponent;
  let fixture: ComponentFixture<MantenimientoPrisionesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoPrisionesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPrisionesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
