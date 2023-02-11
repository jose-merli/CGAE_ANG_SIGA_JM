import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramosLECComponent } from './tramos-lec.component';

describe('TramosLECComponent', () => {
  let component: TramosLECComponent;
  let fixture: ComponentFixture<TramosLECComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TramosLECComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramosLECComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
