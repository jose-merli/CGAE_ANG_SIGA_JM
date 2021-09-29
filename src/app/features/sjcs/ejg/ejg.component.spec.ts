import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EJGComponent } from './ejg.component';

describe('EJGComponent', () => {
  let component: EJGComponent;
  let fixture: ComponentFixture<EJGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EJGComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
