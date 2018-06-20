import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaResolucionesComponent } from './comunica-resoluciones.component';

describe('ComunicaResolucionesComponent', () => {
  let component: ComunicaResolucionesComponent;
  let fixture: ComponentFixture<ComunicaResolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaResolucionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaResolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
