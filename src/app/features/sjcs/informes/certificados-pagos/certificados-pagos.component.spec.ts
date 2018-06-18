import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosPagosComponent } from './certificados-pagos.component';

describe('CertificadosPagosComponent', () => {
  let component: CertificadosPagosComponent;
  let fixture: ComponentFixture<CertificadosPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadosPagosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
