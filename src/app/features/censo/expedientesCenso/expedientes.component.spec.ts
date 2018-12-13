import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediadoresComponent } from './mediadores.component';

describe('MediadoresComponent', () => {
  let component: MediadoresComponent;
  let fixture: ComponentFixture<MediadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediadoresComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
