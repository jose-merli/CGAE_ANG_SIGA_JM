import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCertificacionFacComponent } from './tabla-certificacion-fac.component';

describe('TablaCertificacionFacComponent', () => {
  let component: TablaCertificacionFacComponent;
  let fixture: ComponentFixture<TablaCertificacionFacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaCertificacionFacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCertificacionFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
