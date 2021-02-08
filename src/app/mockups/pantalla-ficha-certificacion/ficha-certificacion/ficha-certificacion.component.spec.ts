import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCertificacionComponent } from './ficha-certificacion.component';

describe('FichaCertificacionComponent', () => {
  let component: FichaCertificacionComponent;
  let fixture: ComponentFixture<FichaCertificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaCertificacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
