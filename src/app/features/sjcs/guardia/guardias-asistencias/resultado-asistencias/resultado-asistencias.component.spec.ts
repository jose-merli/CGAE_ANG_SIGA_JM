import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAsistenciasComponent } from './resultado-asistencias.component';

describe('ResultadoAsistenciasComponent', () => {
  let component: ResultadoAsistenciasComponent;
  let fixture: ComponentFixture<ResultadoAsistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoAsistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
