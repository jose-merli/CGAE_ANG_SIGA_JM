import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaEjgComponent } from './busqueda-ejg.component';

describe('EjgComponent', () => {
  let component: BusquedaEjgComponent;
  let fixture: ComponentFixture<BusquedaEjgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaEjgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaEjgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
