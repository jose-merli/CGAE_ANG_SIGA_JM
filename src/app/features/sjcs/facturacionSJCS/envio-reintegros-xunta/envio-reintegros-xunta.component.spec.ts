import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioReintegrosXuntaComponent } from './envio-reintegros-xunta.component';

describe('EnvioReintegrosXuntaComponent', () => {
  let component: EnvioReintegrosXuntaComponent;
  let fixture: ComponentFixture<EnvioReintegrosXuntaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvioReintegrosXuntaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioReintegrosXuntaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
