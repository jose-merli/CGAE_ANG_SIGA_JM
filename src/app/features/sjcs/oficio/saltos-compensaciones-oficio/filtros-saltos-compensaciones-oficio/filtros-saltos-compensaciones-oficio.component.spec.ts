import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosSaltosCompensacionesOficioComponent } from './filtros-saltos-compensaciones-oficio.component';

describe('FiltrosSaltosCompensacionesOficioComponent', () => {
  let component: FiltrosSaltosCompensacionesOficioComponent;
  let fixture: ComponentFixture<FiltrosSaltosCompensacionesOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosSaltosCompensacionesOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosSaltosCompensacionesOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
