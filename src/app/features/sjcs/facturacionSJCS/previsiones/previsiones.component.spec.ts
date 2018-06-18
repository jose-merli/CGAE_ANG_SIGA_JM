import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisionesComponent } from './previsiones.component';

describe('PrevisionesComponent', () => {
  let component: PrevisionesComponent;
  let fixture: ComponentFixture<PrevisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrevisionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
