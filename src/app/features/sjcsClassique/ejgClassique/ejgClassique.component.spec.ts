import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EJGClassiqueComponent } from './ejgClassique.component';

describe('EJGClassiqueComponent', () => {
  let component: EJGClassiqueComponent;
  let fixture: ComponentFixture<EJGClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EJGClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EJGClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
