import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoSolicitudesCentralitaComponent } from './resultado-solicitudes-centralita.component';

describe('ResultadoSolicitudesCentralitaComponent', () => {
  let component: ResultadoSolicitudesCentralitaComponent;
  let fixture: ComponentFixture<ResultadoSolicitudesCentralitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoSolicitudesCentralitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoSolicitudesCentralitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
