import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBusquedaEJGComponent } from './filtro-busqueda-ejg.component';

describe('BusquedaEJGComponent', () => {
  let component: FiltroBusquedaEJGComponent;
  let fixture: ComponentFixture<FiltroBusquedaEJGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroBusquedaEJGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBusquedaEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
