import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoCertificadosComponent } from './mantenimiento-certificados.component';

describe('MantenimientoCertificadosComponent', () => {
  let component: MantenimientoCertificadosComponent;
  let fixture: ComponentFixture<MantenimientoCertificadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoCertificadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
