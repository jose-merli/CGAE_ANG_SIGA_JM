import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaremosComponent } from './baremos.component';

describe('BaremosComponent', () => {
  let component: BaremosComponent;
  let fixture: ComponentFixture<BaremosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaremosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaremosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
