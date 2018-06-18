import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaRemesaEnvioComponent } from './comunica-remesa-envio.component';

describe('ComunicaRemesaEnvioComponent', () => {
  let component: ComunicaRemesaEnvioComponent;
  let fixture: ComponentFixture<ComunicaRemesaEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaRemesaEnvioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaRemesaEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
