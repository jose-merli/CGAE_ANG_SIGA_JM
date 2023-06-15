import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosFundamentosresolucionComponent } from './filtros-fundamentosresolucion.component';

describe('FiltrosFundamentosresolucionComponent', () => {
  let component: FiltrosFundamentosresolucionComponent;
  let fixture: ComponentFixture<FiltrosFundamentosresolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosFundamentosresolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosFundamentosresolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
