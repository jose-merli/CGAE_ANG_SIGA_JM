import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCertificacionComponent } from './busqueda-certificacion.component';

describe('BusquedaCertificacionComponent', () => {
  let component: BusquedaCertificacionComponent;
  let fixture: ComponentFixture<BusquedaCertificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaCertificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
