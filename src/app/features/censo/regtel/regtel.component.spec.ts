import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegtelComponent } from './regtel.component';

describe('RegtelComponent', () => {
  let component: RegtelComponent;
  let fixture: ComponentFixture<RegtelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegtelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegtelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
