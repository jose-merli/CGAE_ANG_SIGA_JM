import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundamentosCalificacionComponent } from './fundamentos-calificacion.component';

describe('FundamentosCalificacionComponent', () => {
  let component: FundamentosCalificacionComponent;
  let fixture: ComponentFixture<FundamentosCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundamentosCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundamentosCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
