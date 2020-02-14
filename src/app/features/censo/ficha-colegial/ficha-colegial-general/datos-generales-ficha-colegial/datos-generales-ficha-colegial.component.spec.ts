import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFichaColegialComponent } from './datos-generales-ficha-colegial.component';

describe('DatosGeneralesFichaColegialComponent', () => {
  let component: DatosGeneralesFichaColegialComponent;
  let fixture: ComponentFixture<DatosGeneralesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
