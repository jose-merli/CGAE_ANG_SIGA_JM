import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosAcaComponent } from './certificados-aca.component';

describe('CertificadosAcaComponent', () => {
  let component: CertificadosAcaComponent;
  let fixture: ComponentFixture<CertificadosAcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificadosAcaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosAcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
