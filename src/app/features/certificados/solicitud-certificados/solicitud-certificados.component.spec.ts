import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudCertificadosComponent } from './solicitud-certificados.component';

describe('SolicitudCertificadosComponent', () => {
  let component: SolicitudCertificadosComponent;
  let fixture: ComponentFixture<SolicitudCertificadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudCertificadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudCertificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
