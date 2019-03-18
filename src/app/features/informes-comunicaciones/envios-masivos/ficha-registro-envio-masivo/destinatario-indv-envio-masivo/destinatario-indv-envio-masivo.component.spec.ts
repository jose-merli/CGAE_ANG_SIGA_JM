import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatarioIndvEnvioMasivoComponent } from './destinatario-indv-envio-masivo.component';

describe('DestinatarioIndvEnvioMasivoComponent', () => {
  let component: DestinatarioIndvEnvioMasivoComponent;
  let fixture: ComponentFixture<DestinatarioIndvEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinatarioIndvEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatarioIndvEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
