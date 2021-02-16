import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBusquedaEJGComponent } from './tabla-busqueda-ejg.component';

describe('ResultadoEJGComponent', () => {
  let component: TablaBusquedaEJGComponent;
  let fixture: ComponentFixture<TablaBusquedaEJGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaBusquedaEJGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBusquedaEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
