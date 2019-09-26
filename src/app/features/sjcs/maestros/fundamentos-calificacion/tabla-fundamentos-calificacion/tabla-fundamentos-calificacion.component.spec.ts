import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaFundamentosCalificacionComponent } from './tabla-fundamentos-calificacion.component';

describe('TablaFundamentosCalificacionComponent', () => {
  let component: TablaFundamentosCalificacionComponent;
  let fixture: ComponentFixture<TablaFundamentosCalificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaFundamentosCalificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaFundamentosCalificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
