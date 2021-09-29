import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionTurnosComponent } from './configuracion-turnos.component';

describe('ConfiguracionTurnosComponent', () => {
  let component: ConfiguracionTurnosComponent;
  let fixture: ComponentFixture<ConfiguracionTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionTurnosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
