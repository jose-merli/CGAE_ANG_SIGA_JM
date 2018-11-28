import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionEnvioMasivoComponent } from './configuracion-envio-masivo.component';

describe('ConfiguracionEnvioMasivoComponent', () => {
  let component: ConfiguracionEnvioMasivoComponent;
  let fixture: ComponentFixture<ConfiguracionEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
