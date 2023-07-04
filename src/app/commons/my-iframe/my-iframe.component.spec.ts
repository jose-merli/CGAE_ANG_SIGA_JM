import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIframeComponent } from './my-iframe.component';

describe('MyIframeComponent', () => {
  let component: MyIframeComponent;
  let fixture: ComponentFixture<MyIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
