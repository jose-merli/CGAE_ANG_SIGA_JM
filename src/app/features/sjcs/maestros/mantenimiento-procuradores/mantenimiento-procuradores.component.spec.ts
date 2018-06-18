import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoProcuradoresComponent } from './mantenimiento-procuradores.component';

describe('MantenimientoProcuradoresComponent', () => {
  let component: MantenimientoProcuradoresComponent;
  let fixture: ComponentFixture<MantenimientoProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoProcuradoresComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
