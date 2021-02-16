import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAplicacionEnPagosComponent } from './resultado-aplicacionEnPagos.component';

describe('ResultadoAplicacionEnPagosComponent', () => {
  let component: ResultadoAplicacionEnPagosComponent;
  let fixture: ComponentFixture<ResultadoAplicacionEnPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoAplicacionEnPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoAplicacionEnPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
