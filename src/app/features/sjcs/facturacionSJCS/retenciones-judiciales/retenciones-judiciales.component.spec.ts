import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionesJudicialesComponent } from './retenciones-judiciales.component';

describe('RetencionesJudicialesComponent', () => {
  let component: RetencionesJudicialesComponent;
  let fixture: ComponentFixture<RetencionesJudicialesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RetencionesJudicialesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionesJudicialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
