import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaActuacionAsistenciaComponent } from './ficha-actuacion-asistencia.component';

describe('FichaActuacionAsistenciaComponent', () => {
  let component: FichaActuacionAsistenciaComponent;
  let fixture: ComponentFixture<FichaActuacionAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaActuacionAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaActuacionAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
