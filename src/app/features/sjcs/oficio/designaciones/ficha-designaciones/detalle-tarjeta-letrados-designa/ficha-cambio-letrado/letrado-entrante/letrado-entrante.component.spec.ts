import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetradoEntranteComponent } from './letrado-entrante.component';

describe('LetradoEntranteComponent', () => {
  let component: LetradoEntranteComponent;
  let fixture: ComponentFixture<LetradoEntranteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetradoEntranteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetradoEntranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
