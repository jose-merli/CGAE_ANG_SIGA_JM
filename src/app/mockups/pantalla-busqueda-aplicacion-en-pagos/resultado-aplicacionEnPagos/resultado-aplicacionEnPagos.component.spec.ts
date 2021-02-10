import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoAsuntosComponent } from './resultado-asuntos.component';

describe('ResultadoAsuntosComponent', () => {
  let component: ResultadoAsuntosComponent;
  let fixture: ComponentFixture<ResultadoAsuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoAsuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoAsuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
