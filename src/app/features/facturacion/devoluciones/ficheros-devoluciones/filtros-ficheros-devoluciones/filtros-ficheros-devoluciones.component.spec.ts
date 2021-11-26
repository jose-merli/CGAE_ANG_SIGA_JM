import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosFicherosDevolucionesComponent } from './filtros-ficheros-devoluciones.component';

describe('FiltrosFicherosDevolucionesComponent', () => {
  let component: FiltrosFicherosDevolucionesComponent;
  let fixture: ComponentFixture<FiltrosFicherosDevolucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosFicherosDevolucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosFicherosDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
