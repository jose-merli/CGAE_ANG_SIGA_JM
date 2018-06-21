import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosIrpfComponent } from './certificados-irpf.component';

describe('CertificadosIrpfComponent', () => {
  let component: CertificadosIrpfComponent;
  let fixture: ComponentFixture<CertificadosIrpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadosIrpfComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosIrpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
