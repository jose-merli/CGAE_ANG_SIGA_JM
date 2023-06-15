import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaFactProgramadasComponent } from './ficha-fact-programadas.component';

describe('FichaFactProgramadasComponent', () => {
  let component: FichaFactProgramadasComponent;
  let fixture: ComponentFixture<FichaFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
