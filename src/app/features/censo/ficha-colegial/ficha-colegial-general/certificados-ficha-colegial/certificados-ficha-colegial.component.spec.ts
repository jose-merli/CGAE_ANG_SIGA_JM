import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosFichaColegialComponent } from './certificados-ficha-colegial.component';

describe('CertificadosFichaColegialComponent', () => {
  let component: CertificadosFichaColegialComponent;
  let fixture: ComponentFixture<CertificadosFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadosFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
