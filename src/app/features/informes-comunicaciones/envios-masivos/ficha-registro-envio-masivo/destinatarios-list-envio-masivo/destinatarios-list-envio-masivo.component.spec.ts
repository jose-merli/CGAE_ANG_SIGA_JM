import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinatariosListEnvioMasivoComponent } from './destinatarios-list-envio-masivo.component';

describe('DestinatariosEnvioMasivoComponent', () => {
  let component: DestinatariosListEnvioMasivoComponent;
  let fixture: ComponentFixture<DestinatariosListEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatariosListEnvioMasivoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinatariosListEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
