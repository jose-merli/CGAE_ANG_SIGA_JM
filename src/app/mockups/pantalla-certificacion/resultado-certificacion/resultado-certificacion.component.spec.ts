import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoCertificacionComponent } from './resultado-certificacion.component';

describe('ResultadoCertificacionComponent', () => {
  let component: ResultadoCertificacionComponent;
  let fixture: ComponentFixture<ResultadoCertificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoCertificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
