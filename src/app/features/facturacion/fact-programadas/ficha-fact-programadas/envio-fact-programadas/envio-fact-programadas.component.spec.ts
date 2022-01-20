import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioFactProgramadasComponent } from './envio-fact-programadas.component';

describe('EnvioFactProgramadasComponent', () => {
  let component: EnvioFactProgramadasComponent;
  let fixture: ComponentFixture<EnvioFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvioFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
