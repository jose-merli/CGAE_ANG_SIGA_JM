import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosMonederoComponent } from './movimientos-monedero.component';

describe('MovimientosMonederoComponent', () => {
  let component: MovimientosMonederoComponent;
  let fixture: ComponentFixture<MovimientosMonederoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimientosMonederoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosMonederoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
