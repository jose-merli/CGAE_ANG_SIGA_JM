import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtipoCurricularComponent } from './subtipo-curricular.component';

describe('SubtipoCurricularComponent', () => {
  let component: SubtipoCurricularComponent;
  let fixture: ComponentFixture<SubtipoCurricularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtipoCurricularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtipoCurricularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
