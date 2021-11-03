import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotasSuscripcionesComponent } from './cuotas-suscripciones.component';

describe('CuotasSuscripcionesComponent', () => {
  let component: CuotasSuscripcionesComponent;
  let fixture: ComponentFixture<CuotasSuscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuotasSuscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuotasSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
