import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SOJComponent } from './soj.component';

describe('SOJComponent', () => {
  let component: SOJComponent;
  let fixture: ComponentFixture<SOJComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SOJComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SOJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
