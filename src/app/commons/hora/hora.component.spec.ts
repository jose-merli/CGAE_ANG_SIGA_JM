import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraComponent } from './hora.component';

describe('HoraComponent', () => {
  let component: HoraComponent;
  let fixture: ComponentFixture<HoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
