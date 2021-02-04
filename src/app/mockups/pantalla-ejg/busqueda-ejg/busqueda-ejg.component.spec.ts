import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaEJGComponent } from './busqueda-ejg.component';

describe('BusquedaEJGComponent', () => {
  let component: BusquedaEJGComponent;
  let fixture: ComponentFixture<BusquedaEJGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaEJGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
