import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionEnvioMasivoComponent } from './programacion-envio-masivo.component';

describe('ProgramacionEnvioMasivoComponent', () => {
  let component: ProgramacionEnvioMasivoComponent;
  let fixture: ComponentFixture<ProgramacionEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramacionEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramacionEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
