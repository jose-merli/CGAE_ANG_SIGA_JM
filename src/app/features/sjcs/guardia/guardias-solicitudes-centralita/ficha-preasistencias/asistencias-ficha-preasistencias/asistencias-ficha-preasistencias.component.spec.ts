import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasFichaPreasistenciasComponent } from './asistencias-ficha-preasistencias.component';

describe('AsistenciasFichaPreasistenciasComponent', () => {
  let component: AsistenciasFichaPreasistenciasComponent;
  let fixture: ComponentFixture<AsistenciasFichaPreasistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciasFichaPreasistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasFichaPreasistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
