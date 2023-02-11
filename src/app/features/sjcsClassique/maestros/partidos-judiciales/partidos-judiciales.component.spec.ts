import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidosJudicialesClassiqueComponent } from './partidos-judiciales.component';

describe('PartidosJudicialesClassiqueComponent', () => {
  let component: PartidosJudicialesClassiqueComponent;
  let fixture: ComponentFixture<PartidosJudicialesClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartidosJudicialesClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidosJudicialesClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
