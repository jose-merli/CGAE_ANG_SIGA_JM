import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRemesasResolucionesComponent } from './filtro-remesas-resoluciones.component';

describe('FiltroRemesasResolucionesComponent', () => {
  let component: FiltroRemesasResolucionesComponent;
  let fixture: ComponentFixture<FiltroRemesasResolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRemesasResolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRemesasResolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
