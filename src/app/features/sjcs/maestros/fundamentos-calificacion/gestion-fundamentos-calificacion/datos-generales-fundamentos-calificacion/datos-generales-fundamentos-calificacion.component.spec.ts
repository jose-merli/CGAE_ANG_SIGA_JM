import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFundamentosCalificacionComponent } from './datos-generales-fundamentos-calificacion.component';

describe('DatosGeneralesFundamentosCalificacionComponent', () => {
  let component: DatosGeneralesFundamentosCalificacionComponent;
  let fixture: ComponentFixture<DatosGeneralesFundamentosCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFundamentosCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFundamentosCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
