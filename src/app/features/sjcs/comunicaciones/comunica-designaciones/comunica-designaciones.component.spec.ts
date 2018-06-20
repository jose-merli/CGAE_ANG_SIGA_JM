import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaDesignacionesComponent } from './comunica-designaciones.component';

describe('ComunicaResolucionesComponent', () => {
  let component: ComunicaDesignacionesComponent;
  let fixture: ComponentFixture<ComunicaDesignacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaDesignacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaDesignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
