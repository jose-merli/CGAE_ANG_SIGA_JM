import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionJuzComponent } from './direccion-juz.component';

describe('DireccionJuzComponent', () => {
  let component: DireccionJuzComponent;
  let fixture: ComponentFixture<DireccionJuzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DireccionJuzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccionJuzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
