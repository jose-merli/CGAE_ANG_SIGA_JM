import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionColaOficioComponent } from './configuracion-colaoficio.component';

describe('ConfiguracionTurnosComponent', () => {
  let component: ConfiguracionColaOficioComponent;
  let fixture: ComponentFixture<ConfiguracionColaOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionColaOficioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionColaOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
