import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionFacComponent } from './certificacion-fac.component';

describe('CertificacionFacComponent', () => {
  let component: CertificacionFacComponent;
  let fixture: ComponentFixture<CertificacionFacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificacionFacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificacionFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
