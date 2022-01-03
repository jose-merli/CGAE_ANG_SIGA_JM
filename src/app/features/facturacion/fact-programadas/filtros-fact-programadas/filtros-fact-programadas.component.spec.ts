import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosFactProgramadasComponent } from './filtros-fact-programadas.component';

describe('FiltrosFactProgramadasComponent', () => {
  let component: FiltrosFactProgramadasComponent;
  let fixture: ComponentFixture<FiltrosFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
