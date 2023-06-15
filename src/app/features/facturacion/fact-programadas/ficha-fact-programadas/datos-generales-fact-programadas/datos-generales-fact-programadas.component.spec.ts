import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesFactProgramadasComponent } from './datos-generales-fact-programadas.component';

describe('DatosGeneralesFactProgramadasComponent', () => {
  let component: DatosGeneralesFactProgramadasComponent;
  let fixture: ComponentFixture<DatosGeneralesFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosGeneralesFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
