import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBarDatosGeneralesComponent } from './ficha-bar-datos-generales.component';

describe('FichaBarDatosGeneralesComponent', () => {
  let component: FichaBarDatosGeneralesComponent;
  let fixture: ComponentFixture<FichaBarDatosGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBarDatosGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBarDatosGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
