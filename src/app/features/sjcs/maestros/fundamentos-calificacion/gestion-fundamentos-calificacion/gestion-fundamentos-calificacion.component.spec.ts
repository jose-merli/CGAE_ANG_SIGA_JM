import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFundamentosCalificacionComponent } from './gestion-fundamentos-calificacion.component';

describe('GestionFundamentosCalificacionComponent', () => {
  let component: GestionFundamentosCalificacionComponent;
  let fixture: ComponentFixture<GestionFundamentosCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFundamentosCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFundamentosCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
