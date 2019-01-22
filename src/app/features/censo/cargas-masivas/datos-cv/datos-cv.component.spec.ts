import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCvComponent } from './datos-cv.component';

describe('DatosCvComponent', () => {
  let component: DatosCvComponent;
  let fixture: ComponentFixture<DatosCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
