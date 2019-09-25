import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroFundamentosCalificacionComponent } from './filtro-fundamentos-calificacion.component';

describe('FiltroFundamentosCalificacionComponent', () => {
  let component: FiltroFundamentosCalificacionComponent;
  let fixture: ComponentFixture<FiltroFundamentosCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroFundamentosCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroFundamentosCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
