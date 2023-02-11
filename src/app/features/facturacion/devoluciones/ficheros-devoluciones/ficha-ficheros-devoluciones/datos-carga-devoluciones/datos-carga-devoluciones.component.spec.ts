import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCargaDevolucionesComponent } from './datos-carga-devoluciones.component';

describe('DatosCargaDevolucionesComponent', () => {
  let component: DatosCargaDevolucionesComponent;
  let fixture: ComponentFixture<DatosCargaDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCargaDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCargaDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
