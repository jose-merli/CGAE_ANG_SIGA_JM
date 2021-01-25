import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionEnvioMasivoComponent } from './descripcion-envio-masivo.component';

describe('DescripcionEnvioMasivoComponent', () => {
  let component: DescripcionEnvioMasivoComponent;
  let fixture: ComponentFixture<DescripcionEnvioMasivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescripcionEnvioMasivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionEnvioMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
