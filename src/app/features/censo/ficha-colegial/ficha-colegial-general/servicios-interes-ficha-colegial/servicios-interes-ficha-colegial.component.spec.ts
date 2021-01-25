import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosInteresFichaColegialComponent } from './servicios-interes-ficha-colegial.component';

describe('ServiciosInteresFichaColegialComponent', () => {
  let component: ServiciosInteresFichaColegialComponent;
  let fixture: ComponentFixture<ServiciosInteresFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosInteresFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosInteresFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
