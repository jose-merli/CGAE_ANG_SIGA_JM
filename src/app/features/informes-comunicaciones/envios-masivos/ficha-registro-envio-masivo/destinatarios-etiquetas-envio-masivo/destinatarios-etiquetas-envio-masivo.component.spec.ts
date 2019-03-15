import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosEnvioMasivoComponent } from './destinatarios-etiquetas-envio-masivo.component';

describe('DestinatariosEnvioMasivoComponent', () => {
  let component: DestinatariosEnvioMasivoComponent;
  let fixture: ComponentFixture<DestinatariosEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatariosEnvioMasivoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
