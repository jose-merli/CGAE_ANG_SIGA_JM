import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetradoSalienteComponent } from './letrado-saliente.component';

describe('LetradoSalienteComponent', () => {
  let component: LetradoSalienteComponent;
  let fixture: ComponentFixture<LetradoSalienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetradoSalienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetradoSalienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
