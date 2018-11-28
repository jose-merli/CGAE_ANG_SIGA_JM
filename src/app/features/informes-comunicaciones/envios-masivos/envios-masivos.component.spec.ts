import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviosMasivosComponent } from './envios-masivos.component';

describe('EnviosMasivosComponent', () => {
  let component: EnviosMasivosComponent;
  let fixture: ComponentFixture<EnviosMasivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviosMasivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviosMasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
