import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCertificacionFacComponent } from './ficha-certificacion-fac.component';

describe('FichaCertificacionFacComponent', () => {
  let component: FichaCertificacionFacComponent;
  let fixture: ComponentFixture<FichaCertificacionFacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaCertificacionFacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCertificacionFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
