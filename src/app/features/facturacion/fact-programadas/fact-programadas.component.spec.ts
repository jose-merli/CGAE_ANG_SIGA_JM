import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactProgramadasComponent } from './fact-programadas.component';

describe('FactProgramadasComponent', () => {
  let component: FactProgramadasComponent;
  let fixture: ComponentFixture<FactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
