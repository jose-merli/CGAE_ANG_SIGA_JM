import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenAdeudosFactProgramadasComponent } from './gen-adeudos-fact-programadas.component';

describe('GenAdeudosFactProgramadasComponent', () => {
  let component: GenAdeudosFactProgramadasComponent;
  let fixture: ComponentFixture<GenAdeudosFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenAdeudosFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenAdeudosFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
