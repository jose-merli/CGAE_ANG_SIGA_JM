import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyAccordionComponent } from './empty-accordion.component';

describe('EmptyAccordionComponent', () => {
  let component: EmptyAccordionComponent;
  let fixture: ComponentFixture<EmptyAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
