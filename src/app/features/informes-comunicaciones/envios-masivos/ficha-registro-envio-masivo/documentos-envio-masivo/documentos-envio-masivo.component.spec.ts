import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosEnvioMasivoComponent } from './documentos-envio-masivo.component';

describe('DocumentosEnvioMasivoComponent', () => {
  let component: DocumentosEnvioMasivoComponent;
  let fixture: ComponentFixture<DocumentosEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
