import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisariasComponent } from './comisarias.component';

describe('ComisariasComponent', () => {
  let component: ComisariasComponent;
  let fixture: ComponentFixture<ComisariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
