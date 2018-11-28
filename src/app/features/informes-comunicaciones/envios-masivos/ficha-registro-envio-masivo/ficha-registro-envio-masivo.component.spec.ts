import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaRegistroEnvioMasivoComponent } from './ficha-registro-envio-masivo.component';

describe('FichaRegistroEnvioMasivoComponent', () => {
  let component: FichaRegistroEnvioMasivoComponent;
  let fixture: ComponentFixture<FichaRegistroEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaRegistroEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaRegistroEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
