import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoProcuradoresClassiqueComponent } from './mantenimiento-procuradores.component';

describe('MantenimientoProcuradoresClassiqueComponent', () => {
  let component: MantenimientoProcuradoresClassiqueComponent;
  let fixture: ComponentFixture<MantenimientoProcuradoresClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoProcuradoresClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoProcuradoresClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
