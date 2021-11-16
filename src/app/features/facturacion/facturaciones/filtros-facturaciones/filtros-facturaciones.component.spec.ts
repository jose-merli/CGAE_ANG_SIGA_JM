import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosFacturacionesComponent } from './filtros-facturaciones.component';

describe('FiltrosFacturacionesComponent', () => {
  let component: FiltrosFacturacionesComponent;
  let fixture: ComponentFixture<FiltrosFacturacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosFacturacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosFacturacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
