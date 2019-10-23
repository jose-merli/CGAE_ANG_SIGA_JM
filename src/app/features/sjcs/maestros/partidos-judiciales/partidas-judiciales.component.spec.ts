import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidosJudicialesComponent } from './partidas-judiciales.component';

describe('PartidosJudicialesComponent', () => {
  let component: PartidosJudicialesComponent;
  let fixture: ComponentFixture<PartidosJudicialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartidosJudicialesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidosJudicialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
