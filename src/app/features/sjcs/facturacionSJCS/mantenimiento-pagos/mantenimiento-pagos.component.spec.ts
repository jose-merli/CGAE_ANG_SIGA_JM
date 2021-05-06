import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoPagosComponent } from './mantenimiento-pagos.component';

describe('MantenimientoPagosComponent', () => {
  let component: MantenimientoPagosComponent;
  let fixture: ComponentFixture<MantenimientoPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoPagosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
