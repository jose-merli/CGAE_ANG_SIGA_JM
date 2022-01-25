import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaExpExeaDatosGeneralesComponent } from './ficha-exp-exea-datos-generales.component';

describe('FichaExpExeaDatosGeneralesComponent', () => {
  let component: FichaExpExeaDatosGeneralesComponent;
  let fixture: ComponentFixture<FichaExpExeaDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaExpExeaDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaExpExeaDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
