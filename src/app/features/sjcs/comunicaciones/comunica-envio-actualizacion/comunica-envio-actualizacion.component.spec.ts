import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaEnvioActualizacionComponent } from './comunica-envio-actualizacion.component';

describe('ComunicaEnvioActualizacionComponent', () => {
  let component: ComunicaEnvioActualizacionComponent;
  let fixture: ComponentFixture<ComunicaEnvioActualizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaEnvioActualizacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaEnvioActualizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
