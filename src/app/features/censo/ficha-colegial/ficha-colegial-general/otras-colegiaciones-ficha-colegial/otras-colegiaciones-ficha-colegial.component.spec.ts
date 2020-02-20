import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrasColegiacionesFichaColegialComponent } from './otras-colegiaciones-ficha-colegial.component';

describe('OtrasColegiacionesFichaColegialComponent', () => {
  let component: OtrasColegiacionesFichaColegialComponent;
  let fixture: ComponentFixture<OtrasColegiacionesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrasColegiacionesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrasColegiacionesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
