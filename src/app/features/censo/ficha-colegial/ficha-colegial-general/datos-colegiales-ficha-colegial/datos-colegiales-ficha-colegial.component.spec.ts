import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosColegialesFichaColegialComponent } from './datos-colegiales-ficha-colegial.component';

describe('DatosColegialesFichaColegialComponent', () => {
  let component: DatosColegialesFichaColegialComponent;
  let fixture: ComponentFixture<DatosColegialesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosColegialesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosColegialesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
