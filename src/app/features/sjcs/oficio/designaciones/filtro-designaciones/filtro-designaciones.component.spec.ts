import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroDesignacionesComponent } from './filtro-designaciones.component';

describe('BuscadorJustificacionExpresComponent', () => {
  let component: FiltroDesignacionesComponent;
  let fixture: ComponentFixture<FiltroDesignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroDesignacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroDesignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
