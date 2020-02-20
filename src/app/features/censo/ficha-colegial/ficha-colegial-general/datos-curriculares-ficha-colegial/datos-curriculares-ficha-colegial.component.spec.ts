import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosCurricularesFichaColegialComponent } from './datos-curriculares-ficha-colegial.component';

describe('DatosCurricularesFichaColegialComponent', () => {
  let component: DatosCurricularesFichaColegialComponent;
  let fixture: ComponentFixture<DatosCurricularesFichaColegialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosCurricularesFichaColegialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosCurricularesFichaColegialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
