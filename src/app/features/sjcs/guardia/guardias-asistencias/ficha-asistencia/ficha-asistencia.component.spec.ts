import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAsistenciaComponent } from './ficha-asistencia.component';

describe('FichaAsistenciaComponent', () => {
  let component: FichaAsistenciaComponent;
  let fixture: ComponentFixture<FichaAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
