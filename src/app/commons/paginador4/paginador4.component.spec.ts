import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paginador4Component } from './paginador4.component';

describe('Paginador4Component', () => {
  let component: Paginador4Component;
  let fixture: ComponentFixture<Paginador4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Paginador4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Paginador4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
