import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAsistenciaExpresComponent } from './resultado-asistencia-expres.component';

describe('ResultadoAsistenciaExpresComponent', () => {
  let component: ResultadoAsistenciaExpresComponent;
  let fixture: ComponentFixture<ResultadoAsistenciaExpresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoAsistenciaExpresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoAsistenciaExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
